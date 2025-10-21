import React, { useState } from "react";
import Title from "../components/Title";
import UploadForm from "../components/UploadForm";
import ImageGrid from "../components/ImageGrid";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import useFirestore from "../hooks/useFirestore";

const User = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { docs } = useFirestore("images");

  return (
    <div className="mt-20">
      <Navbar />
      <Title />
      <UploadForm />
      <ImageGrid 
        docs={docs} 
        setSelectedImage={setSelectedImage} 
        setSelectedIndex={setSelectedIndex}
      />
      {selectedImage && (
        <Modal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          docs={docs}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}
    </div>
  );
};

export default User;
