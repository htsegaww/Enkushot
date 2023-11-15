import React from "react";
import Navbar from "../components/Navbar";
import about from "../assets/about-image.jpg";
const About = () => {
  return (
    <>
      <Navbar />
      <h1 className="about-h1">about</h1>
      <span className="underline"></span>

      <div className="about">
        <img src={about} />
        <div className="about-description">
          <p className="p-1">
            This website is just for everyone to share their pictures. You don't
            have to worry about creating a real Gmail or Yahoo account for this,
            You can just put "yourname@gmail.com", it can still work.
          </p>
          <p>
            All I ask in return is that you be respectful with the pictures you
            share.
          </p>
        </div>
      </div>
      <p className="footer">LET'S SHARE OUR PHOTOGRAPHY...📸</p>
    </>
  );
};

export default About;
