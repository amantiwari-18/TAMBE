import React from "react";
import "@/App.css";
import { Toaster } from 'sonner';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Products from "./components/Products";
import EngineeringProcess from "./components/EngineeringProcess";
import WhyChoose from "./components/WhyChoose";
import Gallery from "./components/Gallery";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" richColors />
      <Navbar />
      <Hero />
      <About />
      <Products />
      <EngineeringProcess />
      <WhyChoose />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
