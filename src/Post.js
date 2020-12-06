import React, { useState, useEffect } from "react";
import "./Post.css";
import firebase from "firebase";
import Avatar from "@material-ui/core/Avatar";
import { db } from "./firebase";
import Comment from "./Comment";
import { Button, Input } from "@material-ui/core";
function Post({ user, postId, username, imageUrl, caption }) {
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: userComment,
      username: user?.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setUserComment("");
  };

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId, comments]);
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/avatar/1.png"
        />
        <h3>{username}</h3>
      </div>

      <img className="post__image" src={imageUrl} alt="" />
      <h4 className="post__text">
        <strong>{username}:</strong> {caption}
      </h4>
      {comments?.map((comment) => (
        <Comment comment={comment.text} username={comment.username} />
      ))}
      {user && (
        <form className="post__submitPost">
          <Input
            className="submitPost__input"
            type="text"
            placeholder="Add a comment"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
          />
          <Button
            disabled={!userComment}
            onClick={(e) => handleSubmit(e)}
            className="submitPost__post"
            type="submit"
          >
            Post
          </Button>
        </form>
      )}
    </div>
  );
}

export default Post;
