import React from 'react'
import Header from '../components/Header'
import Slider from '../components/Slider'
import About from '../components/About'
import Founder from '../components/Founder'
import Services from '../components/Services'
import Appointment from '../components/Appointment'
import Reviews from '../components/Reviews'
import Footer from '../components/Footer'
import AppointmentHeader from '../components/AppointmentHeader'

const Home = () => {
  return (
    <div>
        <Header />
      <Slider />
      <About />
      <Founder/>
      <Services />
      <AppointmentHeader/>
      <Appointment />
      <Reviews />
      <Footer />
    </div>
  )
}
export default Home
