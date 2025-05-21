import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import Footer from './components/Footer';
import CreateRecipe from './components/CreateRecipe';
import BasicCard from './components/BasicCard';
import ExpandedCard from './components/ExpandedCard';
import RecipeFilter from './components/RecipeFilter';
import About from './components/About';
import Contact from './components/Contact';
import Terms from './components/Terms';
import Home from './components/Home';
import './components/Card.css'
import './components/Header.css';
import './components/Footer.css';
import './components/Login.css';
import './components/RecipeFilter.css';
import './components/Home.css';


function App() {  
  return (
    <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
      <Route path="/create" element={<CreateRecipe />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
    </Routes>
  </Router>
  );
}

export default App;
