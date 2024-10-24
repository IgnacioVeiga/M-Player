import React, { useState } from 'react';
import './App.css';
import AudioPlayer from './components/AudioPlayer';
import FileList from './components/FileList';
import FileSelector from './components/FileSelector';

const App = () => {
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentFile = files[currentFileIndex];

  // This will be called when files are selected through FileSelector
  const loadFiles = (newFiles) => {
    const parsedFiles = newFiles.map((filePath) => {
      // Mock metadata extraction - in reality, you'd extract metadata like title, artist, etc.
      return {
        title: 'Unknown Title', // You would extract real metadata here
        artist: 'Unknown Artist', // Real artist data
        album: 'Unknown Album', // Real album data
        duration: 'Unknown Duration', // Real duration from the file
        path: filePath
      };
    });
    setFiles((prevFiles) => [...prevFiles, ...parsedFiles]);
  };

  const handlePrevious = () => {
    setCurrentFileIndex((prevIndex) => (prevIndex === 0 ? files.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    setCurrentFileIndex((prevIndex) => (prevIndex === files.length - 1 ? 0 : prevIndex + 1));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleFileSelect = (file) => {
    const index = files.findIndex((f) => f.path === file.path);
    if (index !== -1) {
      setCurrentFileIndex(index);
      setIsPlaying(true);
    }
  };

  return (
    <div className="app">
      <div className="player-container">
        <AudioPlayer
          file={currentFile}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onPlayPause={handlePlayPause}
          isPlaying={isPlaying}
        />
        <FileSelector onFilesSelected={loadFiles} />
      </div>
      <FileList files={files} onFileSelect={handleFileSelect} />
    </div>
  );
};

export default App;
