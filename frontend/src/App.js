import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Characters from "./pages/Characters";
import Shows from "./pages/Shows";
import Gallery from "./pages/Gallery";
import News from "./pages/News";
import Contact from "./pages/Contact";
import SecureAdmin from "./pages/SecureAdmin";
import LiveAdmin from "./pages/LiveAdmin";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <AuthProvider>
      <div className="App">
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
              <Route path="/admin" element={<SecureAdmin />} />
              <Route path="/live-editor" element={<LiveAdmin />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;