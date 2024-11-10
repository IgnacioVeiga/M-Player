import React, { useEffect, useRef, useState } from 'react';
import './Controls.css';

export default function Controls({ file, onPrevious, onNext, onPlayPause, isPlaying }) {
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

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    }

    return (
        <footer>
            <div className='controls-left'>
                <button onClick={onPrevious}>
                    <span className='material-icons'>skip_previous</span>
                </button>
                <button onClick={onPlayPause}>
                    {
                        isPlaying ?
                            <span className='material-icons'>pause</span>
                            :
                            <span className='material-icons'>play_arrow</span>
                    }
                </button>
                <button onClick={onNext}>
                    <span className='material-icons'>skip_next</span>
                </button>
            </div>

            <div className="progress">
                <span>{formatTime(progress)}</span>

                <progress
                    value={(progress / duration) * 100 || 0}
                    min="0" max="100"
                    onChange={handleProgressChange}
                />

                <span>{formatTime(duration)}</span>
            </div>

            <div className='controls-right'>
                <button>
                    <span className='material-icons-outlined'>volume_up</span>
                </button>
                <button>
                    <span className='material-icons'>repeat</span>
                </button>
                <button>
                    <span className='material-icons'>shuffle</span>
                </button>
            </div>
        </footer>
    );
}