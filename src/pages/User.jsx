import React, { useState } from "react";
import Title from "../components/Title";
import UploadForm from "../components/UploadForm";
import ImageGrid from "../components/ImageGrid";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import useFirestore from "../hooks/useFirestore";
import { useAuth } from "../hooks/useAuth";

const User = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { user } = useAuth();
  const { docs } = useFirestore("images");
  
  // Filter to show only the current user's photos
  const myPhotos = user ? docs.filter(doc => doc.userEmail === user.email) : [];

  return (
    <div className="mt-20">
      <Navbar />
      <Title />
      <UploadForm />
      {/* Display count of user's photos */}
      {user && (
        <div className="text-center mt-4 mb-2">
          <p className="text-gray-700 font-medium">
            {myPhotos.length > 0 
              ? `📸 You have ${myPhotos.length} photo${myPhotos.length > 1 ? 's' : ''}`
              : "📸 You haven't uploaded any photos yet"}
          </p>
        </div>
      )}
      <ImageGrid 
        docs={myPhotos} 
        setSelectedImage={setSelectedImage} 
        setSelectedIndex={setSelectedIndex}
      />
      {selectedImage && (
        <Modal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          docs={myPhotos}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
        />
      )}
    </div>
  );
};

export default User;
