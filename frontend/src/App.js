import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductSearch from './components/ProductSearch';
import Mission from './components/Mission';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<ProductSearch />} />
          <Route path="/mission" element={<Mission />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
