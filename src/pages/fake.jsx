import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
// import loginImage from "../assets/loginImage.avif";

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
    <>
      <div className="login-container">
        <div className="form-container">
          <div className="bottom-bg"></div>
          <form onSubmit={login} className="form">
            <div className="login-input">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Password</label>
              <input
                type="password"
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

      {/* fake */}

      <form
        onSubmit={handleSubmit}
        className="w-72 flex flex-col justify-center items-center gap-3 bg-white m-auto my-10 border rounded-xl p-4 absolute top-24 left-16 "
      >
        {error && error}
        <div className="flex flex-col justify-start items-start p-10 w-72 gap-5">
          <label className="flex items-center justify-start">
            Email Address
          </label>

          <input
            className=" border-b-2 outline-none cursor-text border-gray-300 w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Enter your email"
            required
          />
          <label className="flex items-center justify-start">Password</label>
          <input
            className=" border-b-2  outline-none cursor-text border-gray-300 w-full "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Enter your password"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-[#043b22] text-white rounded-full w-52 px-5 py-3"
        >
          Sign Up
        </button>

        <div className="p-10">
          <p className="text-center">You have an account?</p>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-[#043b22] bg-white rounded-full w-52 px-5 py-3 m-5 border border-[#043b22] font-bold"
          >
            Login
          </button>
        </div>
      </form>
    </>
  );
};

export default Login;
