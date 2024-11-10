import React from 'react';
import './Navbar.css';

export default function Navbar() {
    return (
        <header>
            <input type="text" placeholder="Search music ... " />
            <div className="user-profile">
                <img src="user-icon.png" alt="User" />
            </div>
        </header>
    );
}
