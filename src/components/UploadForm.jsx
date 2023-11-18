import React, { useState } from "react";
import ProgressBar from "./ProgressBar";
import { FaUpload } from "react-icons/fa";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const types = ["image/jpeg", "image/png", "image/jpg"];
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
    <form>
      <label className="label">
        <input type="file" onChange={changeHandler} />
        <div className="btn">
          <span className="upload">Upload</span>
          <span>
            <FaUpload />
          </span>
        </div>
      </label>
      <div className="output">
        {error && <div className="error">{error}</div>}
        {file && <div>{file.name}</div>}
        {file && <ProgressBar file={file} setFile={setFile} />}
      </div>
    </form>
  );
};

export default UploadForm;
