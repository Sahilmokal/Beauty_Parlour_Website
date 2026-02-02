import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";

import Home from "./pages/Home.jsx";
import Courses from "./pages/Courses.jsx";
import Abouts from "./pages/About.jsx";
import Servicess from "./pages/Services.jsx";
import Location from "./pages/Location.jsx";
import Appointments from "./pages/Appointment.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AppointmentHistory from "./pages/AppointmentHistory.jsx";
import BookService from "./components/BookService.jsx";
import Booking from "./pages/Booking.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import CourseBookingModal from "./components/CourseBookingModal.jsx";
import EnrollmentsPage from "./pages/Enrollments.jsx";
import ProfilePage from "./pages/Profile.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentCancel from "./pages/PaymentCancel.jsx";


function App() {
  return (
    <Router>
      <ScrollToTop />

      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<Abouts />} />
        <Route path="/services" element={<Servicess />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/location" element={<Location />} />
        <Route path="/appointment" element={<Appointments />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={< RegisterPage/>} />
        <Route path="/contact" element={< CourseBookingModal/>} />
        <Route path="/enrollments" element={< EnrollmentsPage/>} />
         <Route path="/profile" element={< ProfilePage/>} />
<Route path="/appointment-history" element={<AppointmentHistory />} />
<Route path="/book-service" element={<Booking />}/>
<Route path="/my-bookings" element={<MyBookings/>}/>
<Route path="/admin" element={<AdminLogin/>}/>
<Route path="/adminDashboard" element={<AdminDashboard/>}/>
<Route path="/payment-success" element={<PaymentSuccess />} />
  <Route path="/payment-cancel" element={<PaymentCancel />} />
      </Routes>

      
    </Router>
  );
}

export default App;
