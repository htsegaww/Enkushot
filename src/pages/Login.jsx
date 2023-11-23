import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate } from "react-router-dom";
// import photography from "../assets/photography.avif";

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
        navigate("/user");
        toast.success("Logged in successfully!");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Wrong Email or password. Please try again!");
      });
  };

  return (
    <div className="max-w-82 relative">
      <div className=" flex gap-10 justify-center items-center m-auto mt-20 h-[700px] bg-[#52c66e] border-green-800 w-96 rounded-xl">
        <div className="clip-path w-full h-full bg-[#043b22] rounded-lg">
          <h3 className="text-xl text-white mt-16 ml-6 mb-1">Welcome 😊</h3>
          <p className="text-sm text-white ml-6">
            Login to add your awesome pictures 📸
          </p>
        </div>
      </div>

      <div>
        <form
          onSubmit={login}
          className=" max-w-[285px] w-full flex flex-col justify-center items-center gap-3 bg-white m-auto my-10 border rounded-xl p-3 absolute top-24 left-28 lg:right-[120px] md:right-[120px]"
        >
          <div className="flex flex-col justify-start items-start p-10 w-72 gap-5">
            <label className="flex items-center justify-start">
              Email Address
            </label>
            <input
              className=" border-b-2 outline-none cursor-text border-gray-300 w-full"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="flex items-center justify-start">Password</label>
            <input
              className=" border-b-2  outline-none cursor-text border-gray-300 w-full "
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-[#043b22] text-white rounded-full w-52 px-5 py-3"
          >
            Log In
          </button>

          <div className="p-10">
            <p className="text-center">OR </p>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-[#043b22] bg-white rounded-full w-52 px-5 py-3 m-5 border border-[#043b22] font-bold"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
