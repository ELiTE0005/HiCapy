import React from "react";
import "./WaitlistHero.css";

export const WaitlistHero = () => {
  return (
    <div className="waitlist-hero-container">
      <div className="waitlist-main">
        {/* Background Decorative Layer */}
        <div className="waitlist-bg">
          {/* Image 3 (Back) - spins clockwise */}
          <div className="absolute inset-0 animate-spin-slow" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <div className="center-abs" style={{ width: "2000px", height: "2000px", transform: "translate(-50%, -50%) rotate(279deg)", zIndex: 0 }}>
              <img
                src="https://framerusercontent.com/images/oqZEqzDEgSLygmUDuZAYNh2XQ9U.png?scale-down-to=2048"
                alt=""
                className="img-cover"
                style={{ opacity: 0.5 }}
              />
            </div>
          </div>

          {/* Image 2 (Middle) - spins counter-clockwise */}
          <div className="absolute inset-0 animate-spin-slow-reverse" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <div className="center-abs" style={{ width: "1000px", height: "1000px", transform: "translate(-50%, -50%) rotate(304deg)", zIndex: 1 }}>
              <img
                src="https://framerusercontent.com/images/UbucGYsHDAUHfaGZNjwyCzViw8.png?scale-down-to=1024"
                alt=""
                className="img-cover"
                style={{ opacity: 0.6 }}
              />
            </div>
          </div>

          {/* Image 1 (Front) - spins clockwise */}
          <div className="absolute inset-0 animate-spin-slow" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
            <div className="center-abs" style={{ width: "800px", height: "800px", transform: "translate(-50%, -50%) rotate(48deg)", zIndex: 2 }}>
              <img
                src="https://framerusercontent.com/images/Ans5PAxtJfg3CwxlrPMSshx2Pqc.png"
                alt="Bg Layout"
                className="img-cover"
                style={{ opacity: 0.8 }}
              />
            </div>
          </div>
        </div>

        {/* Gradient Overlay */}
        <div className="gradient-overlay" />

        {/* Content Container */}
        <div className="content-container">
          <div className="app-icon" style={{ background: 'white' }}>
            <img 
              src="/favicon.svg" 
              alt="HiCapy Icon" 
              className="img-cover" 
              style={{ objectFit: 'contain', padding: '8px' }}
            />
          </div>

          <h1 className="hero-title pt-4">
            HiCapy
          </h1>

          <p className="hero-subtitle">
            Make your miserable life a little easier with HiCapy...
          </p>

          <div className="loading-spinner pt-8">
            <div className="spinner-circle"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
