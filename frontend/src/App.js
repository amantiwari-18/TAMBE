import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'sonner';
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Products from "./components/Products";
import EngineeringProcess from "./components/EngineeringProcess";
import WhyChoose from "./components/WhyChoose";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminSettings from "./pages/AdminSettings";
import AdminHero from "./pages/AdminHero";

const HomePage = () => (
  <>
    <Navbar />
    <Hero />
    <About />
    <Products />
    <EngineeringProcess />
    <WhyChoose />
    <Gallery />
    <Contact />
    <Footer />
    <WhatsAppButton />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <div className="App">
          <Toaster position="top-right" richColors />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/hero" element={<AdminHero />} />
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          </Routes>
        </div>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
