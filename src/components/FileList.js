import React from 'react';

const FileList = ({ onFileSelect }) => {
    // Temporary hardcoded list of files (replace this with real files)
    const files = [
        { title: 'Song 1', artist: 'Artist 1', album: 'Album 1', duration: '3:45', path: 'path-to-song1' },
        { title: 'Song 2', artist: 'Artist 2', album: 'Album 2', duration: '4:20', path: 'path-to-song2' }
    ];

    return (
        <div className="file-list">
            {files.map((file, index) => (
                <div key={index} className="file-item" onClick={() => onFileSelect(file)}>
                    <div className="file-info">
                        <span className="file-title">{file.title}</span>
                        <span className="file-artist-album">{file.artist} - {file.album}</span>
                        <span className="file-duration">{file.duration}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileList;
