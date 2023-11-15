import React from "react";
import useFirestore from "../hooks/useFirestore";
import { motion } from "framer-motion";
import { FcLike } from "react-icons/fc";

const ImageGrid = ({ setSelectedImage }) => {
  const { docs } = useFirestore("images");

  return (
    <>
      <div className="img-grid">
        {docs &&
          docs.map((doc) => (
            <motion.div
              key={doc.url}
              layout
              whileHover={{ opacity: 0.8 }}
              className="img-wrap"
              onClick={() => setSelectedImage(doc.url)}
            >
              <motion.img
                src={doc.url}
                alt="images"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              />
              <motion.div className="card-data">
                <h3 className="card-email">
                  Picture by: {doc.userEmail.split("@")[0]}
                  {/* Picture by: {doc.userEmail} */}
                </h3>
                <span className="card-date">
                  Date: {doc.createdAt.toLocaleDateString()}
                </span>
              </motion.div>
            </motion.div>
          ))}
      </div>
    </>
  );
};

export default ImageGrid;
