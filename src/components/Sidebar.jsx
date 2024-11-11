import React from 'react';
import '../styles/Sidebar.css';

export default function Sidebar({ onFilesSelected }) {
    const handleSelectFiles = async () => {
        const selectedFiles = await window.Electron.selectAudioFiles();
        if (selectedFiles) {
            onFilesSelected(selectedFiles); // Pass the files with metadata
        }
    };

    return (
        <nav>
            <ul>
                <li>
                    <span className='material-icons-outlined'>home</span>
                    Principal
                </li>
                <li>
                    <span className='material-icons-outlined'>explore</span>
                    Explore
                </li>
                <li>
                    <span className='material-icons-outlined'>library_music</span>
                    Library
                </li>
                <li onClick={handleSelectFiles}>
                <span className='material-icons-outlined'>add</span>
                    Add
                </li>
            </ul>
        </nav>
    );
}
