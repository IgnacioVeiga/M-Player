import { useEffect, useRef, useState, useCallback } from "react";
import { AudioFile } from "@/types";

/**
 * Centralized audio/queue controller.
 * Keeps the <audio> element outside the React tree so components stay presentational.
 * If you come from Angular: think of this as a service that holds state + side effects,
 * and components subscribe via the returned values/functions.
 */
export default function useAudioPlayer() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [files, setFiles] = useState<AudioFile[]>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(-1);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);

	// Ensure the audio element exists exactly once.
	if (!audioRef.current) {
		audioRef.current = new Audio();
	}

	const hasTracks = files.length > 0;
	const currentFile = files[currentIndex];

	const addFiles = useCallback((newFiles: AudioFile[]) => {
		setFiles((prev) => {
			const deduped = newFiles.filter(
				(file) => !prev.some((prevFile) => prevFile.path === file.path)
			);
			const merged = [...prev, ...deduped];

			// Auto-select first track added so the user can press play immediately.
			if (prev.length === 0 && merged.length > 0) {
				setCurrentIndex(0);
			}

			return merged;
		});
	}, []);

	const selectFile = useCallback(
		(file: AudioFile) => {
			const index = files.findIndex((f) => f.path === file.path);
			if (index !== -1) setCurrentIndex(index);
		},
		[files]
	);

	const play = useCallback(async () => {
		if (!audioRef.current || !currentFile) return;
		try {
			await audioRef.current.play();
			setIsPlaying(true);
		} catch (err) {
			console.error("Unable to start playback", err);
			setIsPlaying(false);
		}
	}, [currentFile]);

	const pause = useCallback(() => {
		if (!audioRef.current) return;
		audioRef.current.pause();
		setIsPlaying(false);
	}, []);

	const togglePlayPause = useCallback(() => {
		if (!currentFile) return;
		isPlaying ? pause() : play();
	}, [currentFile, isPlaying, pause, play]);

	const playNext = useCallback(() => {
		if (!hasTracks) return;
		setCurrentIndex((prev) => {
			if (prev < 0) return 0;
			return (prev + 1) % files.length;
		});
	}, [files.length, hasTracks]);

	const playPrevious = useCallback(() => {
		if (!hasTracks) return;
		setCurrentIndex((prev) => {
			if (prev <= 0) return files.length - 1;
			return prev - 1;
		});
	}, [files.length, hasTracks]);

	const seek = useCallback(
		(time: number) => {
			if (!audioRef.current) return;
			const safeTime = Math.max(0, Math.min(time, duration || 0));
			audioRef.current.currentTime = safeTime;
			setProgress(safeTime);
		},
		[duration]
	);

	// Wire audio element events (runs once, but re-binds when queue length changes so "ended" sees fresh length).
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => setProgress(audio.currentTime);
		const handleLoadedMetadata = () => setDuration(audio.duration || 0);
		const handleEnded = () => playNext();
		const handlePlay = () => setIsPlaying(true);
		const handlePause = () => setIsPlaying(false);

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("play", handlePlay);
		audio.addEventListener("pause", handlePause);

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("pause", handlePause);
		};
	}, [playNext, files.length]);

	// Load audio when the current selection changes.
	useEffect(() => {
		const audio = audioRef.current;
		const track = files[currentIndex];

		if (!audio || !track) {
			setIsPlaying(false);
			setProgress(0);
			setDuration(0);
			return;
		}

		const loadAndPlay = async () => {
			try {
				const src: string = await window.ipcRenderer.invoke(
					"load-audio-file",
					track.path
				);
				audio.src = src;
				audio.currentTime = 0;
				setProgress(0);
				await audio.play();
				setIsPlaying(true);
			} catch (err) {
				console.error("Error loading audio:", err);
				setIsPlaying(false);
			}
		};

		loadAndPlay();
	}, [currentIndex, files]);

	return {
		files,
		currentFile,
		currentIndex,
		isPlaying,
		progress,
		duration,
		hasTracks,
		addFiles,
		selectFile,
		playNext,
		playPrevious,
		togglePlayPause,
		seek,
	};
}
