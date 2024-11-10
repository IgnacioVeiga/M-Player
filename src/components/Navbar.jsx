import React from 'react';
import './Navbar.css';

const Navbar = () => {
    return (
        <header>
            <input type="text" placeholder="Search music ... " />
            <div className="user-profile">
                <img src="user-icon.png" alt="User" />
            </div>
        </header>
    );
}

export default Navbar;