import React from 'react'
import Header from '../components/Header'
import Locate from '../components/Locate'
import Footer from '../components/Footer'
import Reviews from '../components/Reviews'
import "../Learn.css";

const Location = () => {
  return (
    <div>
      <Header />
      <Locate />
      <Reviews />
      <Footer />
    </div>
  )
}

export default Location