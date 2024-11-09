import React, { useState, useEffect, useRef } from 'react';
import Controls from './Controls';
import ProgressBar from './ProgressBar';
import MetadataDisplay from './MetadataDisplay';

const AudioPlayer = ({ file, onPrevious, onNext, onPlayPause, isPlaying }) => {
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
    <div className="audio-player">
      <MetadataDisplay
        title={file?.title}
        artist={file?.artist}
        album={file?.album}
        image={file?.image}
      />
      <ProgressBar progress={progress} duration={duration} onProgressChange={handleProgressChange} />
      <Controls onPrevious={onPrevious} onNext={onNext} onPlayPause={onPlayPause} isPlaying={isPlaying} />
      <audio ref={audioRef} />
    </div>
  );
};

export default AudioPlayer;
