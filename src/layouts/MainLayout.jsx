import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const MainLayout = ({ children }) => {
    return (
        <div className="main-layout">
            <Navbar />
            <div className="content-wrapper">
                <Sidebar />
                <main className="main-content">{children}</main>
            </div>
        </div>
    );
};

export default MainLayout;
