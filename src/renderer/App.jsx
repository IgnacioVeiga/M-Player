import { useState, useRef, useEffect } from 'react';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());

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
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleFileSelect = (file) => {
    const index = files.findIndex((f) => f.path === file.path);
    if (index !== -1) {
      setCurrentFileIndex(index);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleProgressChange = (newTime) => {
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const updateDuration = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    const audio = audioRef.current;
    if (currentFile) {
      audio.src = currentFile.path;
      audio.play();
      setIsPlaying(true);
    }
  }, [currentFile]);

  return (
    <div className="app">
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar onFilesSelected={loadFiles} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="artwork-container">
        <Artwork file={currentFile} />
      </div>
      <Playlist files={files} file={currentFile} onFileSelect={handleFileSelect} />

      <Controls
        file={currentFile}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onPlayPause={handlePlayPause}
        isPlaying={isPlaying}
        audioRef={audioRef}
        progress={progress}
        duration={duration}
        onProgressChange={handleProgressChange}
      />
    </div>
  );
}
