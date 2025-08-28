import useFirestore from "../hooks/useFirestore";
import { motion } from "framer-motion";
import "../App.css";
import { useAuth } from "../hooks/useAuth";
import { deleteDoc } from "firebase/firestore";

const ImageGrid = ({ setSelectedImage }) => {
  const { docs } = useFirestore("images");
  const { user } = useAuth();

  return (
    <>
      <div className=" img-grid relative">
        {docs &&
          docs.map((doc) => (
            <motion.div
              key={doc.url}
              layout
              whileHover={{ opacity: 0.8 }}
              className="img-wrap group"
              onClick={() => setSelectedImage(doc.url)}
            >
              <motion.img
                src={doc.url}
                alt="images"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              />
              {user && (
                <motion.div className="opacity-0 group-hover:opacity-100  text-white  ">
                  <h3 className="absolute capitalize top-0 left-1">
                    Picture by: {doc.userEmail.split("@")[0]}
                  </h3>

                  {user.email === doc.userEmail && (
                    <button
                      className=" absolute top-0 right-1 bg-red-800 rounded-lg px-2 py-1 text-sm"
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          await deleteDoc(doc.ref);
                          console.log("Document successfully deleted!");
                        } catch (error) {
                          console.error("Error removing document: ", error);
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}

                 
                  <span className=" absolute bottom-0  left-1">
                    Date: {doc.createdAt.toLocaleDateString()}
                  </span>
                </motion.div>
              )}
            </motion.div>
          ))}
      </div>
    </>
  );
};

export default ImageGrid;
