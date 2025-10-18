import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { toast } from "react-toastify";
import { MdOutlineMailLock } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";

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

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign-up successful:", result.user);
      navigate("/");
      toast.success(`Welcome ${result.user.displayName}! Account created successfully.`);
    } catch (error) {
      console.error("Google sign-up error:", error);
      toast.error("Failed to sign up with Google. Please try again.");
    }
  };
  return (
    <div className="m-auto mt-20 p-4 sm:p-8 flex justify-center items-center gap-4">
      <div className="hidden sm:flex flex-col justify-center items-center w-full sm:w-[400px] h-auto sm:h-[600px] gap-5 rounded-xl drop-shadow-lg bg-emerald-200 p-8">
        <h3 className="text-emerald-700 text-2xl">Welcome 😊</h3>
        <p className="text-emerald-700">
          <Link to="/signup">
            <button className="bg-emerald-600 text-white rounded-full w-52 px-5 py-3">
              Create account
            </button>
          </Link>
        </p>
        <span className="text-gray-900">or</span>
        <p className="text-[#3ab49a] text-md">
          <Link to="/login">
            <button className="bg-emerald-600 text-white rounded-full w-52 px-5 py-3">
              Login
            </button>
          </Link>
        </p>
      </div>

      <div className="w-full max-w-[400px]">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center gap-3 bg-white m-auto my-10 border rounded-xl p-4 w-full min-h-[600px] drop-shadow-lg"
        >
          <h1 className="text-2xl text-emerald-700 text-center">Create a new account</h1>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex flex-col justify-start items-start p-6 sm:p-10 w-full max-w-[280px] gap-5">
            <div className="flex flex-start justify-center items-center gap-2 rounded-2xl w-full border-b-2 h-10 px-3">
              <MdOutlineMailLock size={20} />
              <input
                className="flex flex-start outline-none cursor-text border-gray-300 w-full text-gray-950"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="flex flex-start justify-center items-center gap-2 rounded-2xl w-full border-b-2 h-10 px-3">
              <RiLockPasswordFill size={20} />
              <input
                className="flex flex-start outline-none cursor-text border-gray-300 w-full text-gray-950"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-emerald-600 text-white rounded-full w-52 px-5 py-3 hover:bg-emerald-700 transition-colors"
          >
            create account
          </button>

          <div className="w-full flex items-center gap-3 px-6 sm:px-10 my-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="text-gray-400 text-xs font-semibold tracking-wider">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="group relative flex items-center justify-center gap-2 bg-white text-gray-700 rounded-full px-6 py-2.5 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100 transition-all duration-300 transform hover:scale-105 text-sm font-medium w-full max-w-[250px]"
          >
            <FcGoogle size={20} className="transition-transform duration-300 group-hover:rotate-12" />
            <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent group-hover:from-emerald-600 group-hover:to-emerald-700 transition-all duration-300">
              Sign up with Google
            </span>
          </button>

          <div className="mt-4">
            <p className="text-center text-gray-600">Already have an account?</p>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-emerald-600 bg-white rounded-full w-52 px-5 py-3 mt-2 border border-emerald-600 font-bold hover:bg-emerald-50 transition-colors"
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
