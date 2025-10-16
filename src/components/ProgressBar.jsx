import React, { useEffect } from "react";
import useStorage from "../hooks/useStorage";
import { motion } from "framer-motion";

const ProgressBar = ({ file, setFile, metadata = {} }) => {
  const { url, progress } = useStorage(file, metadata);

  //TODO create useEffect to remove the progress bar when the file is uploaded.
  //!set the file to null once the percentage is 100% thats when we know the file is uploaded and the url is ready.
  useEffect(() => {
    if (url) {
      setFile(null);
    }
  }, [url, setFile]);
  return (
    <motion.div
      className="h-2 mt-5 bg-emerald-600"
      initial={{ width: 0 }}
      animate={{ width: progress + "%" }}
    ></motion.div>
  );
};

export default ProgressBar;
