import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log(userCredential);
          navigate("/login");
          toast.success("An account has been created successfully!");
        })
        .catch((error) => {
          console.log(error);
          toast.error("User already exists");
        });
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="container">
      <h1 className="title">Sign Up</h1>
      <form onSubmit={handleSubmit}>
        {error && error}
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Enter your email"
          required
        />
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Enter your password"
          required
        />
        <button type="submit">Sign Up</button>

        <div className="option">
          <p>You have an account?</p>
          <button type="button" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
