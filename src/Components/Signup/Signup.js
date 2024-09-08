import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../../olx-logo.png";
import "./Signup.css";
import { FirebaseContext } from "../../store/Context";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection, query, where, getDocs } from "firebase/firestore";
import { firestoredb } from "../../firebase/config";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { auth } = useContext(FirebaseContext);
  const navigate = useNavigate();
  const validateForm = () => {
    if (!username || !email || !phone || !password) {
      setError("All fields are required");
      return false;
    }
    if (phone.length !== 10) {
      setError("Phone number must be 10 digits");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const checkIfExists = async () => {
    const userCollection = collection(firestoredb, "users");
    const emailQuery = query(userCollection, where("email", "==", email));
    const phoneQuery = query(userCollection, where("phone", "==", phone));
    const usernameQuery = query(
      userCollection,
      where("username", "==", username)
    );
    try {
      const emailSnapshot = await getDocs(emailQuery);
      const usernameSnapshot = await getDocs(usernameQuery);
      const phoneSnapshot = await getDocs(phoneQuery);

      const emailExists = !emailSnapshot.empty;
      const usernameExists = !usernameSnapshot.empty;
      const phoneExists = !phoneSnapshot.empty;
      if (emailExists) {
        setError("Email is already taken");
      } else if (usernameExists) {
        setError("username is already taken");
      } else if (phoneExists) {
        setError("phone number is already in use");
      }
      return emailExists || usernameExists || phoneExists;
    } catch (error) {
      setError("An errro occured");
      return false;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const exists = await checkIfExists();
    if (exists) {
      return;
    }
    setError("");
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(result.user, { displayName: username });

      await addDoc(collection(firestoredb, "users"), {
        id: result.user.uid,
        username: username,
        phone: phone,
        email: email,
      });

      navigate("/login");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("Email is already exist");
      } else {
        setError("Failed to create account");
      }
    }
  };
  return (
    <div>
      <div className="signupParentDiv">
        <img width="200px" height="200px" src={Logo}></img>
        <form onSubmit={handleSubmit}>
          {error && <p style={{ color: "red" }}>{error}</p>}

          <label htmlFor="fname">Username</label>
          <br />
          <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="input"
            type="text"
            id="fname"
            name="name"
            defaultValue="John"
          />
          <br />
          <label htmlFor="fname">Email</label>
          <br />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="input"
            type="email"
            id="fname"
            name="email"
            defaultValue="John"
          />
          <br />
          <label htmlFor="lname">Phone</label>
          <br />
          <input
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            className="input"
            type="number"
            id="lname"
            name="phone"
            defaultValue="Doe"
          />
          <br />
          <label htmlFor="lname">Password</label>
          <br />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            type="password"
            id="lname"
            name="password"
            defaultValue="Doe"
          />
          <br />
          <br />
          <button type="submit">Signup</button>
        </form>
        <a onClick={() => navigate("/login")}>Login</a>
      </div>
    </div>
  );
}
