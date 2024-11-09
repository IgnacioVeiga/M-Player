import React, { useState, useEffect, useRef } from 'react';
import Controls from './Controls';

const AudioPlayer = ({ file, onPrevious, onNext, onPlayPause, isPlaying }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (file && audioRef.current) {
      const audioElement = audioRef.current;

      // Must be a valid audio file path
      audioElement.src = file.path;
      if (isPlaying) {
        audioElement.play().catch((error) => {
          console.error('Error playing the file: ', error);
        });
      } else {
        audioElement.pause();
      }

      const handleTimeUpdate = () => {
        setProgress(audioElement.currentTime);
      };

      const handleLoadedMetadata = () => {
        setDuration(audioElement.duration);
      };

      const handleError = () => {
        console.error('Error loading the file. Supported source not found.');
      };

      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.addEventListener('error', handleError); // Listen error event

      // Cleanup function
      return () => {
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('error', handleError); // Clean error event
      };
    }
  }, [file, isPlaying]); // Dependencies


  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  return (
    <div className="audio-player">
      <div className="album-art">
        {file && file.image ? (
          <img src={file.image} alt="Album Art" />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      <div className="file-metadata">
        <h3>{file ? file.title : 'No title'}</h3>
        <p>{file ? `${file.artist} - ${file.album}` : 'No artist - No album'}</p>
      </div>
      <div className="progress-bar">
        <input
          type="range"
          min="0"
          max="100"
          value={(progress / duration) * 100 || 0}
          onChange={handleProgressChange}
        />
        <div className="time-info">
          <span>{formatTime(progress)}</span> / <span>{formatTime(duration)}</span>
        </div>
      </div>
      <Controls onPrevious={onPrevious} onNext={onNext} onPlayPause={onPlayPause} isPlaying={isPlaying} />
      <audio ref={audioRef} />
    </div>
  );
};

// Helper function to format time in mm:ss
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export default AudioPlayer;
