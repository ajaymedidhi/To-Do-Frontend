// src/components/Navbar.js

import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'

const Navbar = () => {
    const handleLogout = () => { 
        localStorage.removeItem('token');
        window.location.href = '/login';
      };
    
  return (
    <nav>
      <Link to="/"><h1>My Application</h1></Link>
      <ul>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
