import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Import Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// frontend day 1 completed

// Import Pages
import HomePage from './pages/HomePage';
import GalleryPage from './pages/GalleryPage';
import BuilderPage from './pages/BuilderPage';
import OrderPage from './pages/OrderPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        <Navbar />
        
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/create" element={<BuilderPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;