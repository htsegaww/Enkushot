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
    <div className="max-w-82 relative">
      <div className=" flex gap-10 justify-center items-center m-auto mt-20 h-[700px] bg-[#52c66e] border-green-800 w-96 rounded-xl">
        <div className="clip-path w-full h-full bg-[#043b22] rounded-lg">
          <h3 className="text-xl text-white mt-16 ml-6 mb-1">Register 😊</h3>
          <p className="text-sm text-white ml-6">Create a new account 📸</p>
        </div>
      </div>

      <div>
        <form
          onSubmit={handleSubmit}
          className=" max-w-[285px] w-full flex flex-col justify-center items-center gap-3 bg-white m-auto my-10 border rounded-xl p-3 absolute top-24 left-28 lg:right-[120px] md:right-[120px]"
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
      </div>
    </div>
  );
};

export default Signup;
