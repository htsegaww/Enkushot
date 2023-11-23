import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import { FaUpload } from "react-icons/fa";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const types = ["image/jpeg", "image/png", "image/jpg", "image/avif"];
  const changeHandler = (e) => {
    const selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("please select an image file(png , jpeg or jpg)");
    }
  };
  return (
    <form className="max-w-96 hidden lg:block md:block ">
      {user ? (
        <label className="flex flex-col items-center justify-center cursor-pointer">
          <input type="file" onChange={changeHandler} className="hidden" />
          <div className="flex justify-center items-center gap-2 bg-emerald-600 text-white w-32 p-2 rounded-xl mb-10">
            <span className="">Upload</span>
            <span>
              <FaUpload />
            </span>
          </div>
        </label>
      ) : (
        <p>
          {" "}
          <Link to="/login" className="text-[#069668] font-bold">
            Login
          </Link>{" "}
          to upload your pictures📸
        </p>
      )}
      <div className="output">
        {error && <div className="text-red-700 text-center">{error}</div>}
        {file && <div className="text-red-800">{file.name}</div>}
        {file && <ProgressBar file={file} setFile={setFile} />}
      </div>
    </form>
  );
};

export default UploadForm;
