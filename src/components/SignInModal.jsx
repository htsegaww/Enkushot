import React from "react";
import { useNavigate } from "react-router-dom";

const SignInModal = ({ open, onClose, message = "Please sign in to like this image" }) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="signin-backdrop" role="dialog" aria-modal="true">
      <div className="signin-modal">
        <h3 style={{ margin: 0, marginBottom: 12 }}>{message}</h3>
        <p style={{ marginTop: 0, marginBottom: 18, color: "#374151" }}>
          You need an account to favorite images. Sign in to continue.
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onClose();
              navigate("/login");
            }}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
