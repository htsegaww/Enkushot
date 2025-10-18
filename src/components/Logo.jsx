import React from "react";

const Logo = ({ size = 40, className = "" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer glow circle */}
      <circle cx="50" cy="50" r="45" fill="url(#glow)" opacity="0.3" />
      
      {/* Main circle */}
      <circle cx="50" cy="50" r="38" fill="url(#gradient)" />
      
      {/* Camera aperture blades */}
      <g transform="translate(50, 50)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <path
            key={i}
            d="M 0 -15 L 8 -25 L 8 -15 Z"
            fill="#fbbf24"
            transform={`rotate(${angle})`}
          />
        ))}
      </g>
      
      {/* Inner circle (lens) */}
      <circle cx="50" cy="50" r="12" fill="url(#innerGradient)" />
      
      {/* Light sparkle */}
      <circle cx="35" cy="35" r="3" fill="white" opacity="0.8" />
      <circle cx="30" cy="38" r="1.5" fill="white" opacity="0.6" />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#069668" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
        
        <radialGradient id="glow">
          <stop offset="0%" stopColor="#069668" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#069668" stopOpacity="0" />
        </radialGradient>
        
        <radialGradient id="innerGradient">
          <stop offset="0%" stopColor="#1f2937" />
          <stop offset="100%" stopColor="#111827" />
        </radialGradient>
      </defs>
    </svg>
  );
};

export default Logo;
