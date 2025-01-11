// App.js
import './App.css'; // Ensure the path and file exist
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Contact from './components/Contact';
import Subscribe from './components/Subscribe';
import PartnersSection from './components/brands';
import Features from './components/features';
import Feedback from './components/feedback';
import BestSellers from './components/sellers';
// import FeaturedCategories from './components/categories';





function App() {
  return (
    <div className="App">
      <Header />
      <Home />
      <FeaturedCategories />
      <Features />
      <BestSellers />
      <PartnersSection />
      <Feedback />
      <Subscribe />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;