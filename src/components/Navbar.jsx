import React from "react";
import icon from "../assets/icon/icon.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user } = useAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("logged out successfully!");
    } catch (error) {
      error.message;
    }
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={icon} alt="icon" className="img" />
      </Link>
      <Link to="/about" className="nav-about">
        About
      </Link>
      <button className="logout-btn" onClick={handleLogout}>
        Logout : {user.email.split("@")[0]}
      </button>
    </div>
  );
};

export default Navbar;
