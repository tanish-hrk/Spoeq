import React, { useEffect } from "react";
import babyImage from "../../assets/photo-1522778526097-ce0a22ceb253.avif";
import axios from 'axios';

const Home = () => {

  useEffect(() => {
     const fetch = async()=> {
       try {
         const res = await axios.get(import.meta.env.VITE_API_BASE + "/api");
         console.log(res.data);
       } catch (err) {
         console.error('API /api error', err.message);
       }
     };
     fetch();
  }, []);
  const heroStyle = {
    backgroundImage: `url(${babyImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    position: 'relative'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  };

  return (
    <section className="position-relative" style={heroStyle}>
      {/* Dark overlay */}
      <div style={overlayStyle}></div>
      
      {/* Content */}
      <div className="container position-relative" style={{ zIndex: 10 }}>
        <div className="row min-vh-100 align-items-center justify-content-center text-center text-white pt-5">
          <div className="col-12 col-md-8 mt-5">
            <h1 className="display-1 fw-bold mb-4">
              Unleash Your Athletic<br /> Potential
            </h1>
            <p className="fs-3 mb-5">
              Premium Sports Equipment for Champions
            </p>
            <div className="d-flex justify-content-center gap-3">
              <button 
                className="btn btn-lg px-4 py-2"
                style={{ 
                  backgroundColor: '#ea580c',
                  color: 'white'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ea580c'}
              >
                Shop Now
              </button>
              <button 
                className="btn btn-lg btn-dark px-4 py-2"
                onMouseOver={(e) => e.target.style.backgroundColor = '#1d4ed8'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#212529'}
              >
                View Collections
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;