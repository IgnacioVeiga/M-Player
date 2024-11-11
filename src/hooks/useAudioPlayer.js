import { useEffect, useRef, useState } from 'react';

export default function useAudioPlayer(file, isPlaying) {
    const audioRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audioElement = audioRef.current;
        if (file && audioElement) {
            window.Electron.loadAudioFile(file.path).then((audioUrl) => {
                audioElement.src = audioUrl;
                isPlaying ? audioElement.play() : audioElement.pause();
            });

            const updateProgress = () => setProgress(audioElement.currentTime);
            const updateDuration = () => setDuration(audioElement.duration);

            audioElement.addEventListener('timeupdate', updateProgress);
            audioElement.addEventListener('loadedmetadata', updateDuration);

            return () => {
                audioElement.removeEventListener('timeupdate', updateProgress);
                audioElement.removeEventListener('loadedmetadata', updateDuration);
            };
        }
    }, [file, isPlaying]);

    return { audioRef, progress, duration, setProgress };
}