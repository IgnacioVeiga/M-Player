// import { useState, useRef } from 'react';
import '../styles/ProgressBar.css';

export default function ProgressBar({ progress, duration, onProgressChange }) {
    // const [isDragging, setIsDragging] = useState(false);
    // const progressContainerRef = useRef(null);
    // const progressPercentage = (progress / duration) * 100 || 0;

    // const calculateNewTime = (clientX) => {
    //     const rect = progressContainerRef.current.getBoundingClientRect();
    //     const clickX = clientX - rect.left;
    //     return (clickX / rect.width) * duration;
    // };

    // const handleMouseDown = (e) => {
    //     setIsDragging(true);
    //     const newTime = calculateNewTime(e.clientX);
    //     onProgressChange({ target: { value: (newTime / duration) * 100 } });
    // };

    // const handleMouseMove = (e) => {
    //     if (isDragging) {
    //         const newTime = calculateNewTime(e.clientX);
    //         onProgressChange({ target: { value: (newTime / duration) * 100 } });
    //     }
    // };

    // const handleMouseUp = () => {
    //     setIsDragging(false);
    // };

    const handleChange = (e) => {
        const newValue = parseFloat(e.target.value);
        onProgressChange(newValue);
    };

    return (
        // <div
        //     className="progress-container"
        //     ref={progressContainerRef}
        //     onMouseDown={handleMouseDown}
        //     onMouseMove={handleMouseMove}
        //     onMouseUp={handleMouseUp}
        //     onMouseLeave={handleMouseUp}>
        //     <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
        //     <div className="progress-circle" style={{ left: `${progressPercentage}%` }}></div>
        // </div>
        <div className='progress-bar'>
            <input
                type="range"
                min="0"
                max={duration}
                step="0.01"
                value={progress}
                onChange={handleChange}
            />
        </div>
    );
}
