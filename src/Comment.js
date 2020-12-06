import React from "react";
import "./Comment.css";
function Comment({ comment, username }) {
  return (
    <div className="comment">
      <h4 className="comment__text">
        <strong>{username}: </strong>
        {comment}
      </h4>
    </div>
  );
}

export default Comment;
