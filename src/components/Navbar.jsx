// import icon from "../assets/icon/icon.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useAuth } from "../hooks/useAuth";

import { Link, useNavigate } from "react-router-dom";
import { MdPersonAddAlt1, MdPersonRemoveAlt1 } from "react-icons/md";
// import { CgMenuMotion } from "react-icons/cg";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("logged out successfully!");
      navigate("/");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div className=" lg:flex lg:flex-row md:flex-row flex justify-evenly lg:justify-evenly  items-center w-full rounded">
        <Link to="/">
          <h1 className="text-2xl text-[#069668] ">
            Heno
            <span className="">Gram</span>
          </h1>
        </Link>

        {user ? (
          <button
            className="group text-black flex justify-center items-center gap-3"
            onClick={handleLogout}
          >
            <MdPersonRemoveAlt1 size={20} />
            <span className="font-bold text-black capitalize">
              {user.email.split("@")[0]}
              <span className="text-sm ml-4 opacity-0 group-hover:opacity-100  transition-all duration-150 ease-in-out text-[#069668]">
                Logout
              </span>
            </span>
          </button>
        ) : (
          <Link to="/login">
            <button className="text-black flex justify-center items-center gap-3">
              <MdPersonAddAlt1 size={20} />

              <span className="font-bold text-black capitalize ">Login</span>
            </button>
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
