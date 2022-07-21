import React, { useRef, useState } from "react";
import "./App.css";

import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyDjRsR0IpzAkc6tQ326v2au9HQqOIGZiQs",
  authDomain: "chatapp-579bc.firebaseapp.com",
  projectId: "chatapp-579bc",
  storageBucket: "chatapp-579bc.appspot.com",
  messagingSenderId: "637745928297",
  appId: "1:637745928297:web:688372ae64a3438005eaf8",
  measurementId: "G-ZCX7HPZNG3",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <header>
        <SignOut />
      </header>
      <div>
        <section>{user ? <ChatRoom /> : <SignIn />}</section>
      </div>
    </>
  );
}

function SignIn() {
  //sign in function
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };

  return (
    <>
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <p>
        Do not violate the community guidelines or you will be banned for life!
      </p>
    </>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query);
  const [formValue, setFormValue] = useState("");

  const sendMsg = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;
    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.uid} message={msg} />)}
        <div ref={dummy}></div>
      </div>

      <form onSubmit={sendMsg}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">⏩</button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;
  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  );
}

export default App;
