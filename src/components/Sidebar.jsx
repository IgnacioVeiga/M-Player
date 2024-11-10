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
        <div className="sidebar">
            <div className="logo">
                <h2>M-Player</h2>
            </div>
            <nav>
                <ul>
                    <li><span>🏠</span> Principal</li>
                    <li><span>🔍</span> Explore</li>
                    <li><span>📂</span> Library</li>
                    <li onClick={handleSelectFiles}><span>📥</span> Add</li>
                </ul>
            </nav>
        </div>
    );
}

export default Sidebar;