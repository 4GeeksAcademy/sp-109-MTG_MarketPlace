import React from "react";
import "./Footer.css"; // CSS para letra gótica y efectos hover

export const Footer = () => (
  <footer className="footer mt-auto py-4 bg-dark text-white text-center">
    <h5 className="mb-3 gothic-font">Conéctate con nosotros</h5>
    <div className="d-flex justify-content-center gap-3 mb-3">
      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
        <i className="bi bi-facebook"></i>
      </a>
      <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
        <i className="bi bi-twitter"></i>
      </a>
      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
        <i className="bi bi-instagram"></i>
      </a>
      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white fs-4">
        <i className="bi bi-linkedin"></i>
      </a>
    </div>
    <p className="mb-0">&copy; 2025 MTG Marketplace</p>
  </footer>
);
