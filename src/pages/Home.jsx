import React, { useState } from "react";
import Title from "../components/Title";
import UploadForm from "../components/UploadForm";
import ImageGrid from "../components/ImageGrid";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import "../App.css";

const Home = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div>
      <Navbar />
      <Title />
      <UploadForm />
      <ImageGrid setSelectedImage={setSelectedImage} />
      {selectedImage && (
        <Modal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
      )}
    </div>
  );
};

export default Home;
