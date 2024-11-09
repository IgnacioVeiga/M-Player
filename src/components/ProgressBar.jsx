import React from 'react';

const ProgressBar = ({ progress, duration, onProgressChange }) => (
    <div className="progress-bar">
        <input
            type="range"
            min="0"
            max="100"
            value={(progress / duration) * 100 || 0}
            onChange={onProgressChange}
        />
        <div className="time-info">
            <span>{formatTime(progress)}</span> / <span>{formatTime(duration)}</span>
        </div>
    </div>
);

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

export default ProgressBar;
