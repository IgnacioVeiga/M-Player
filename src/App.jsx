import { useState } from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Artwork from './components/Artwork';
import Playlist from './components/Playlist';
import Controls from './components/Controls';

export default function App() {
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentFile = files[currentFileIndex];

  const loadFiles = (newFiles) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
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
      <Sidebar onFilesSelected={loadFiles} />
      <Navbar />

      <div className="art-and-playlist">
        <Artwork file={currentFile} />
        <Playlist files={files} onFileSelect={handleFileSelect} />
      </div>

      <Controls
        file={currentFile}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onPlayPause={handlePlayPause}
        isPlaying={isPlaying}
      />
    </div>
  );
}
