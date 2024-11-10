import React from 'react';
import AudioPlayer from '../components/AudioPlayer/AudioPlayer';
import FileList from '../components/Playlist/FileList';

const Home = () => {
    return (
        <div className="home-page">
            <AudioPlayer />
            <FileList />
        </div>
    );
};

export default Home;
