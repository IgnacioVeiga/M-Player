import { useState, useRef, useEffect, SetStateAction } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Artwork from './components/Artwork';
import Playlist from './components/Playlist';
import Controls from './components/Controls';
import { AudioFile } from './types';

export default function App() {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(new Audio());

  const currentFile = files[currentFileIndex];

  const loadFiles = (newFiles: any) => {
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

  interface HandleFileSelectProps {
    path: string;
    [key: string]: any;
  }

  const handleFileSelect = (file: HandleFileSelectProps) => {
    const index = files.findIndex((f) => f.path === file.path);
    if (index !== -1) {
      setCurrentFileIndex(index);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  const handleProgressChange = (newTime: SetStateAction<number>) => {
    const time = typeof newTime === 'function' ? newTime(progress) : newTime;
    audioRef.current.currentTime = time;
    setProgress(time);
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
    const loadAndPlayAudio = async () => {
      if (currentFile) {
        try {
          const audioUrl = await window.ipcRenderer.invoke('load-audio-file', currentFile.path);
          audio.src = audioUrl;
          await audio.play();
          setIsPlaying(true);
        } catch (err) {
          console.error('Error loading audio:', err);
        }
      }
    };

    loadAndPlayAudio();
  }, [currentFile]);

  return (
  <div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
      <Navbar onMenuClick={toggleSidebar} />
      <Sidebar onFilesSelected={loadFiles} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

    <div className="grid lg:grid-cols-[2fr_1.5fr] gap-4 sm:grid-cols-[1fr] sm:gap-0">
        <Artwork file={currentFile} />
        <Playlist files={files} file={currentFile} onFileSelect={handleFileSelect} />
      </div>

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