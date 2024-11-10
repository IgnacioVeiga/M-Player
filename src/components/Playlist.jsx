import React from 'react';
import './Playlist.css';
import FileList from './FileList'

const Playlist = ({ files, onFileSelect }) => {
    return (
        <div className="playlist">
            <div className="playlist-header">
                <button>UP NEXT</button>
                <button>LYRICS</button>
                <button>RELATED</button>
            </div>
            <FileList files={files} onFileSelect={onFileSelect} />
        </div>
    );
}

export default Playlist;