import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

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

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-in successful:", result.user);
      navigate("/user");
      toast.success(`Welcome ${result.user.displayName}!`);
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email to reset password.");
      return;
    }
    try {
      await import("firebase/auth").then(({ sendPasswordResetEmail }) => sendPasswordResetEmail(auth, email));
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error("Failed to send reset email. Please check your email address.");
    }
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
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-emerald-600 bg-white rounded-full w-full px-5 py-2 border border-emerald-600 mt-2"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="bg-emerald-600 text-white rounded-full w-52 px-5 py-3"
          >
            Log In
          </button>

          <div className="w-full flex items-center gap-3 px-10 my-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-gray-400 text-xs font-semibold tracking-wider">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="group relative flex items-center justify-center gap-2 bg-white text-gray-700 rounded-full px-6 py-2.5 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300 transform hover:scale-105 text-sm font-medium"
          >
            <FcGoogle size={20} className="transition-transform duration-300 group-hover:rotate-12" />
            <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300">
              Sign in with Google
            </span>
          </button>

          <div className="mt-4">
            <p className="text-center text-gray-600">Don't have an account?</p>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-emerald-600 bg-white rounded-full w-52 px-5 py-3 mt-2 border border-emerald-600 font-bold hover:bg-emerald-50 transition-colors"
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
