import React from 'react';
import '../styles/Navbar.css';

export default function Navbar() {
    const userIcon = null;

    return (
        <header>
            <div className='nav-left'>
                <span className='material-icons-outlined'>menu</span>
                M-Player
            </div>

            <input type="text" placeholder="Search music ... " />
            
            <div className="user-profile">
                {
                    userIcon
                        ?
                        <img src='user-icon.png' alt="User" />
                        :
                        <span className="material-icons-outlined">account_circle</span>
                }
            </div>
        </header>
    );
}
