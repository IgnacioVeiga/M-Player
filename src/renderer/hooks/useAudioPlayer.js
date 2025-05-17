import { useEffect, useRef, useState } from 'react';

export default function useAudioPlayer(file, isPlaying) {
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (file && audioElement) {
            const loadAudio = async () => {
                try {
                    const audioUrl = await window.Electron.loadAudioFile(file.path);
                    audioElement.src = audioUrl;
                    audioElement.play();
                } catch (err) {
                    console.error('Error loading audio:', err);
                }
            };
            loadAudio();

            const updateProgress = () => setProgress(audioElement.currentTime);
            const updateDuration = () => setDuration(audioElement.duration);

            audioElement.addEventListener('timeupdate', updateProgress);
            audioElement.addEventListener('loadedmetadata', updateDuration);

            return () => {
                audioElement.removeEventListener('timeupdate', updateProgress);
                audioElement.removeEventListener('loadedmetadata', updateDuration);
            };
        }
    }, [file]);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (audioElement) {
            isPlaying ? audioElement.play() : audioElement.pause();
        }
    }, [isPlaying]);

    return { audioRef, progress, duration, setProgress };
}