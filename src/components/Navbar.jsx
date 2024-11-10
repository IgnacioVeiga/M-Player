import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <header className="navbar">
            <h1 className="navbar-logo">M-Player</h1>
            
            <input type="text" placeholder="Search music ... " />
            
            <nav className="navbar-links">
                <a href="#home">Home</a>
                <a href="#library">Library</a>
            </nav>

            <div className="user-profile">
                <img src="user-icon.png" alt="User" />
            </div>
        </header>
    );
}

export default Navbar;