import React, { useEffect, useRef, useState } from 'react';
import './Controls.css';

const Controls = ({ file, onPrevious, onNext, onPlayPause, isPlaying }) => {
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audioElement = audioRef.current;

        if (file && audioElement) {
            window.Electron.loadAudioFile(file.path).then((audioUrl) => {
                audioElement.src = audioUrl;
                if (isPlaying) {
                    audioElement.play().catch((error) => {
                        alert(`Error playing the file\n${error}`);
                    });
                } else {
                    audioElement.pause();
                }
            }).catch((error) => {
                console.error(error);
            });

            const handleTimeUpdate = () => {
                setProgress(audioElement.currentTime);
            };

            const handleLoadedMetadata = () => {
                setDuration(audioElement.duration);
            };

            const handleError = () => {
                alert('Error loading the file. Supported source not found.');
            };

            audioElement.addEventListener('timeupdate', handleTimeUpdate);
            audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
            audioElement.addEventListener('error', handleError);

            return () => {
                audioElement.removeEventListener('timeupdate', handleTimeUpdate);
                audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
                audioElement.removeEventListener('error', handleError);
            };
        }
    }, [file, isPlaying]);

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * duration;
        audioRef.current.currentTime = newTime;
        setProgress(newTime);
    };

    return (
        <footer>
            <button onClick={onPrevious}>⏮</button>
            <button onClick={onPlayPause}>{isPlaying ? '❚❚' : '►'}</button>
            <button onClick={onNext}>⏭</button>
            <div className="progress">
                <span>{formatTime(progress)}</span>

                <input
                    type="range"
                    min="0"
                    max="100"
                    value={(progress / duration) * 100 || 0}
                    onChange={handleProgressChange}
                />

                <span>{formatTime(duration)}</span>
            </div>

            <button>🔊</button>
            <button>🔁</button>
            <button>🔀</button>
        </footer>
    );
}

const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};

export default Controls;