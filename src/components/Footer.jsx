import React from 'react';
let footerCSS={position: "absolute",
    top: "100vh",
    width: "100vw",
}

function Footer() {
  return (

    <footer className="bg-dark text-white text-center py-3" style={footerCSS}>
      <div className="container">
        <p className="mb-1">&copy; 2025 E-Shop. All rights reserved.</p>
        <div>
          <a className="text-white me-2" href="#">Facebook</a>
          <a className="text-white me-2" href="#">Twitter</a>
          <a className="text-white" href="#">Instagram</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;