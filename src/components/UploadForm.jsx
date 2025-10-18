import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

const UploadForm = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-96 lg:block md:block text-center mb-6">
      {user ? (
        <p className="text-gray-700">Ready to share your moments? Click the <strong>Upload</strong> button above ✨</p>
      ) : (
        <p>
          <Link to="/login" className="text-[#069668] font-bold">Login</Link>{" "}
          to upload your pictures 📸
        </p>
      )}
    </div>
  );
};

export default UploadForm;