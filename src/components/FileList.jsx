import React from 'react';

const FileList = ({ files, onFileSelect }) => {
    return (
        <div className="file-list">
            {files.map((file, index) => (
                <div key={index} className="file-item" onClick={() => onFileSelect(file)}>
                    <div className="file-info">
                        <span className="file-title">{file.title}</span>
                        <span className="file-artist-album">{file.artist} - {file.album}</span>
                        <span className="file-duration">{file.duration ? `${Math.floor(file.duration / 60)}:${Math.floor(file.duration % 60).toString().padStart(2, '0')}` : 'Unknown duration'}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FileList;
