import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

// import "../common.css";
import { toast } from "react-toastify";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
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
        setError(error.message);

        toast.error("Wrong Email or password. Please try again!");
      });
  };

  return (
    <div className=" m-auto mt-20 p-8 flex justify-center items-center gap-4">
      <div className="hidden sm:flex flex-col justify-center items-center w-[400px] h-[600px] gap-5 rounded-xl drop-shadow-lg bg-emerald-100">
        <h3 className="text-emerald-700 text-2xl">Welcome 😊</h3>
        <p className="text-[#3ab49a] text-md">
          <Link to="/login">
            <button className="bg-emerald-600 text-white rounded-full w-52 px-5 py-3">
              Login
            </button>
          </Link>
        </p>
        <span className="text-gray-900">or</span>
        <p className="text-emerald-700">
          <Link to="/signup">
            <button className="bg-emerald-600 text-white rounded-full w-52 px-5 py-3">
              Create account
            </button>
          </Link>
        </p>
      </div>

      <div>
        <form
          onSubmit={login}
          className=" flex flex-col justify-center items-center gap-3 bg-white m-auto my-10 border rounded-xl p-4 w-[400px] h-[600px] drop-shadow-lg "
        >
          <h1 className="text-2xl text-emerald-700">Login</h1>

          {error && error}
          <div className="flex flex-start flex-col justify-center items-center p-10 w-72 gap-5">
            <div className="flex flex-start justify-center items-center gap-2 rounded-2xl w-full border-b-2 h-10 px-3">
              <MdOutlineMailLock size={20} />

              <input
                className="flex flex-start outline-none cursor-text border-gray-300 w-full text-gray-950"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-start justify-center items-center gap-2 rounded-2xl w-full border-b-2 h-10 px-3 ">
              <RiLockPasswordFill size={20} />
              <input
                className="flex flex-start outline-none cursor-text border-gray-300 w-full text-gray-950"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 text-white rounded-full w-52 px-5 py-3"
          >
            Log In
          </button>

          <div className="p-10">
            <p className="text-center mb-2">OR </p>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-emerald-600 bg-white rounded-full w-52 px-5 py-3 m-5 border border-[#043b22] font-bold"
            >
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
