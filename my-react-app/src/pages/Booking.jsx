import React from 'react'
import BookService from '../components/BookService'
import Reviews from '../components/Reviews'
import Footer from '../components/Footer'
import "../css/header.css"
import Header from '../components/Header'
const Booking = () => {
  return (
    <div>
      <Header />
      <BookService />
      <Reviews/>
      <Footer />
    </div>
  )
}

export default Booking
