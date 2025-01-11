import React from 'react'

import Header from './LandingPage/Header'
import Home from './LandingPage/Home'
import FeaturedCategories from './LandingPage/categories'
import Features from './LandingPage/features'
import BestSellers from './LandingPage/sellers'
import PartnersSection from './LandingPage/brands'
import Feedback from './LandingPage/feedback'
import Subscribe from './LandingPage/Subscribe'
import Contact from './LandingPage/Contact'
import Footer from './LandingPage/Footer'


function LandingPage() {
  return (
    <div>
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
  )
}

export default LandingPage
