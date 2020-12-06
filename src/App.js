import React, { useState, useEffect } from "react";
import "./App.css";
import Post from "./Post";
import { auth, db } from "./firebase";
import { Button, Input, makeStyles, Modal } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "50vw",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);

  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);
  const [user, setUser] = useState(null);

  const signUp = (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        setOpen(false);
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((err) => alert(err));
  };
  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setOpenSignIn(false);
      })
      .catch((err) => alert(err));
  };

  const signOut = (e) => {
    e.preventDefault();
    auth.signOut();
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    console.log(user);

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPosts(
          snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
        );
      });
  }, [posts]);
  return (
    <div className="app">
      <Modal open={open} onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form>
            <center className="app__modalContent">
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
              <Input
                placeholder="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Input>
              <Input
                placeholder="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>

              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </center>
          </form>
        </div>
      </Modal>
      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form>
            <center className="app__modalContent">
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
              <Input
                placeholder="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></Input>

              <Input
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Input>
              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </center>
          </form>
        </div>
      </Modal>
      <div className="app__header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        />
        {user ? (
          <div>
            <strong>{user.displayName}</strong>
            <Button onClick={signOut}>Sign Out</Button>
          </div>
        ) : (
          <div>
            <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
          </div>
        )}
      </div>
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <center>
          <h3 style={{ marginTop: "10px" }}>
            Sorry you need to login to upload
          </h3>
        </center>
      )}

      <div className="app__posts">
        {posts?.map(({ id, post }) => (
          <Post
            key={id}
            user={user}
            postId={id}
            username={post.username}
            imageUrl={post.imageUrl}
            caption={post.caption}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
