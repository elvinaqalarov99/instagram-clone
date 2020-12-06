import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyAD6c-G9I1pglYi8ibPFM3CEtYaTA7dQcM",
  authDomain: "instagram-clone-ed61b.firebaseapp.com",
  projectId: "instagram-clone-ed61b",
  storageBucket: "instagram-clone-ed61b.appspot.com",
  messagingSenderId: "9062918171",
  appId: "1:9062918171:web:c1a858f7e1bc30ccb030be",
  measurementId: "G-ES1EGXD3CN",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
