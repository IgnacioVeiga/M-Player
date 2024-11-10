import React from 'react';
import './Sidebar.css';

const Sidebar = ({ onFilesSelected }) => {
    const handleSelectFiles = async () => {
        const selectedFiles = await window.Electron.selectAudioFiles();
        if (selectedFiles) {
            onFilesSelected(selectedFiles); // Pass the files with metadata
        }
    };

    return (
        <aside className="sidebar">
            <div className="logo">
                <h2>M-Player</h2>
            </div>
            <ul className="sidebar-menu">
                <li><a href="#home"><span>🏠</span> Home</a></li>
                <li><a href="#explore"><span>🔍</span> Explore</a></li>
                <li><a href="#library"><span>📂</span> Library</a></li>
                <li onClick={handleSelectFiles}><span>📥</span> Add</li>
            </ul>
        </aside>
    );
}

export default Sidebar;