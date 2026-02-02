import React from 'react'
import Header from '../components/Header'
import Contact from '../components/Contact'
import Reviews from '../components/Reviews'
import Footer from '../components/Footer'
import Appointment from '../components/Appointment'
import Ap_header from '../components/Ap_header'

const Appointments = () => {
  return (
    <div><Header />
    <Ap_header />
    <Appointment />
    
    <Footer />
    </div>
  )
}

export default Appointments