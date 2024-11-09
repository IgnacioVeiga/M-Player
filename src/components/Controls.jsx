import React from 'react';

const Controls = ({ onPrevious, onNext, onPlayPause, isPlaying }) => {
    return (
        <div className="controls">
            <button onClick={onPrevious}>⏮</button>
            <button onClick={onPlayPause}>{isPlaying ? '❚❚' : '►'}</button>
            <button onClick={onNext}>⏭</button>
        </div>
    );
};

export default Controls;
