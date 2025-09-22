import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { MagicCurtain } from "./components/MagicCurtain";
import Home from "./pages/Home";
import About from "./pages/About";
import Characters from "./pages/Characters";
import Shows from "./pages/Shows";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import Contact from "./pages/Contact";
import Admin from "./pages/Admin";
import LiveAdmin from "./pages/LiveAdmin";
import { Toaster } from "./components/ui/sonner";

function App() {
  const [showCurtain, setShowCurtain] = useState(true);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    // Simulate app loading time
    const timer = setTimeout(() => {
      setAppReady(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCurtainComplete = () => {
    setShowCurtain(false);
  };

  return (
    <div className="App">
      {/* Magic Curtain Loader */}
      {showCurtain && (
        <MagicCurtain 
          isLoading={!appReady} 
          onAnimationComplete={handleCurtainComplete}
        />
      )}
      
      {/* Main App Content */}
      <div className={`transition-opacity duration-500 ${showCurtain ? 'opacity-0' : 'opacity-100'}`}>
        <BrowserRouter>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/characters" element={<Characters />} />
              <Route path="/shows" element={<Shows />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:id" element={<News />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;