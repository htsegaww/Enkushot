import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/loginImage.avif";
// import "../common.css";
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
    <div className="login-container">
      <div className="form-container">
        <div className="bottom-bg"></div>
        <form onSubmit={login} className="form">
          <div className="login-input">
            <label>Email Address</label>
            <input
              type="email"
              // placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
              type="password"
              // placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>

          <div className="option">
            <p>OR </p>
            <button type="button" onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
