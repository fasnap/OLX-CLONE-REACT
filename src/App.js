import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Create from "./Pages/Create";
import View from "./Pages/ViewPost";
import { AuthContext, FirebaseContext } from "./store/Context";
import { onAuthStateChanged } from "firebase/auth";
import Post from "./store/PostContext";
import Edit from "./Components/Edit/Edit";
function App() {
  const { setUser } = useContext(AuthContext);
  const { auth } = useContext(FirebaseContext);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  });
  return (
    <div>
      <Post>
        <Router>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create" element={<Create />} />
            <Route path="/view" element={<View />} />
            <Route path="/edit" element={<Edit />} />
            {/* <Route path="/delete" element={<Delete />} /> */}
          </Routes>
        </Router>
      </Post>
    </div>
  );
}

export default App;
