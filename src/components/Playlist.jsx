import { useState } from 'react';
import FileList from './FileList';
import '../styles/Playlist.css';
import Lyrics from './Lyrics';

export default function Playlist({ files, file, onFileSelect }) {
    const [activeTab, setActiveTab] = useState('UP_NEXT');

    const renderContent = () => {
        switch (activeTab) {
            case 'LYRICS':
                return <Lyrics file={file} />;
            case 'RELATED':
                return <div>Related content here...</div>;
            default:
                return <FileList files={files} onFileSelect={onFileSelect} />;
        }
    };

    return (
        <div className="playlist">
            <div className="playlist-header">
                <button onClick={() => setActiveTab('UP_NEXT')}>UP NEXT</button>
                <button onClick={() => setActiveTab('LYRICS')}>LYRICS</button>
                <button onClick={() => setActiveTab('RELATED')}>RELATED</button>
            </div>
            <div className="scrollable-content">
                {renderContent()}
            </div>
        </div>
    );
}
