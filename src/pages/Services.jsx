import React from 'react'
import ServicesIntro from '../components/ServicesIntro';
import ServicesGrid from '../components/ServicesGrid';
import DetailedServices from '../components/DetailedServices';

import Header from '../components/Header';
import Footer from '../components/Footer';

const Servicess = () => {
  return (
    <div>
      <Header />
      <ServicesIntro />
      <ServicesGrid />
      
      <DetailedServices />
      <Footer />
    </div>
  )
}
export default Servicess;
