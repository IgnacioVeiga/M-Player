import React from 'react';
import '../styles/FileList.css'

export default function FileList ({ files, onFileSelect }) {
    return (
        <ul>
            {files.map((file, index) => (
                <li key={index} onClick={() => onFileSelect(file)}>
                    <img src="thumbnail1.png" alt="Thumb" />
                    <div className="song-info">
                        <p>{file.title}</p>
                        <span>{file.artist} - {file.album}</span>
                    </div>
                    <span>{file.duration ? `${Math.floor(file.duration / 60)}:${Math.floor(file.duration % 60).toString().padStart(2, '0')}` : 'Unknown duration'}</span>
                </li>
            ))}
        </ul>
    );
};
