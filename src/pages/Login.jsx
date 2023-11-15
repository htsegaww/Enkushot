import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";

import "../common.css";
import { toast } from "react-toastify";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const login = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        navigate("/");
        toast.success("Logged in successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Wrong Email or password. Please try again!");
      });
  };

  return (
    <div className="container">
      <h1 className="title">Log In</h1>
      <form onSubmit={login}>
        <label className="label-field">Email</label>
        <input
          className="input-field"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label className="label-field">Password</label>

        <input
          className="input-field"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <button type="submit">Log In</button>

        <div className="option">
          <p>create a new account... </p>
          <button type="button" onClick={() => navigate("/signup")}>
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
