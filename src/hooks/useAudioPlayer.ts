import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AudioFile, RepeatMode } from "@/types";
import {
	loadQueue,
	loadSettings,
	loadPositions,
	saveQueue,
	saveSettings,
	savePosition,
	PersistedQueue,
	PersistedSettings,
	PositionMap,
} from "@/player/persistence";
import {
	clampVolume,
	createAudioElement,
	getRandomIndex,
	isRepeatMode,
} from "@/player/audioUtils";

/**
 * Orchestrates playback state and side-effects.
 * Internally composes small helpers (persistence, audio utils) to stay readable.
 */
export default function useAudioPlayer() {
	const audioRef = useRef<HTMLAudioElement | null>(createAudioElement());
	const loadRequestRef = useRef<number>(0);
	const positionsRef = useRef<PositionMap>({});

	// Core state
	const [files, setFiles] = useState<AudioFile[]>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(-1);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);

	// Preferences
	const [volume, setVolume] = useState<number>(1);
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const [shuffleEnabled, setShuffleEnabled] = useState<boolean>(false);
	const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");

	const hasTracks = files.length > 0;
	const currentFile = currentIndex >= 0 ? files[currentIndex] : undefined;

	// --- Persistence bootstrap ------------------------------------------------
	useEffect(() => {
		positionsRef.current = loadPositions();

		const restoredSettings = loadSettings();
		if (restoredSettings) {
			if (typeof restoredSettings.volume === "number") {
				setVolume(clampVolume(restoredSettings.volume));
			}
			if (typeof restoredSettings.isMuted === "boolean") {
				setIsMuted(restoredSettings.isMuted);
			}
			if (typeof restoredSettings.shuffleEnabled === "boolean") {
				setShuffleEnabled(restoredSettings.shuffleEnabled);
			}
			if (isRepeatMode(restoredSettings.repeatMode)) {
				setRepeatMode(restoredSettings.repeatMode);
			}
		}

		const restoredQueue = loadQueue();
		if (restoredQueue?.paths?.length) {
			window.ipcRenderer
				.invoke("load-audio-metadata", restoredQueue.paths)
				.then((restoredFiles: AudioFile[]) => {
					if (!restoredFiles.length) return;
					setFiles(restoredFiles);
					const safeIndex = Math.min(
						Math.max(restoredQueue.currentIndex ?? 0, 0),
						restoredFiles.length - 1
					);
					setCurrentIndex(safeIndex);
				})
				.catch((err: unknown) => {
					console.error("Unable to restore queue", err);
				});
		}
	}, []);

	// Persist queue whenever it changes.
	useEffect(() => {
		const queuePayload: PersistedQueue = {
			paths: files.map((file) => file.path),
			currentIndex,
		};
		saveQueue(queuePayload);
	}, [currentIndex, files]);

	// Persist settings whenever they change.
	useEffect(() => {
		const settingsPayload: PersistedSettings = {
			volume,
			isMuted,
			shuffleEnabled,
			repeatMode,
		};
		saveSettings(settingsPayload);
	}, [isMuted, repeatMode, shuffleEnabled, volume]);

	// Keep audio element in sync with preferences.
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.volume = volume;
		audio.muted = isMuted;
	}, [isMuted, volume]);

	// --- Actions -------------------------------------------------------------
	const addFiles = useCallback((newFiles: AudioFile[]) => {
		setFiles((prev) => {
			const deduped = newFiles.filter(
				(file) => !prev.some((prevFile) => prevFile.path === file.path)
			);
			const merged = [...prev, ...deduped];
			if (prev.length === 0 && merged.length > 0) setCurrentIndex(0);
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

	const setVolumeLevel = useCallback((next: number) => {
		const safe = clampVolume(next);
		setVolume(safe);
		setIsMuted(safe === 0);
	}, []);

	const toggleMute = useCallback(() => setIsMuted((prev) => !prev), []);
	const toggleShuffle = useCallback(() => setShuffleEnabled((prev) => !prev), []);
	const toggleRepeatMode = useCallback(() => {
		setRepeatMode((prev) => (prev === "all" ? "one" : prev === "one" ? "off" : "all"));
	}, []);

	const play = useCallback(async () => {
		if (!audioRef.current || !currentFile) return;
		try {
			if (audioRef.current.ended) audioRef.current.currentTime = 0;
			await audioRef.current.play();
			setIsPlaying(true);
		} catch (err) {
			console.error("Unable to start playback", err);
			setIsPlaying(false);
		}
	}, [currentFile]);

	const pause = useCallback(() => {
		audioRef.current?.pause();
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
			if (shuffleEnabled) return getRandomIndex(files.length, prev);
			return (prev + 1) % files.length;
		});
	}, [files.length, hasTracks, shuffleEnabled]);

	const playPrevious = useCallback(() => {
		if (!hasTracks) return;
		setCurrentIndex((prev) => {
			if (prev <= 0) return files.length - 1;
			return prev - 1;
		});
	}, [files.length, hasTracks]);

	const seek = useCallback(
		(time: number) => {
			const audio = audioRef.current;
			if (!audio) return;
			const safe = Math.max(0, Math.min(time, duration || 0));
			audio.currentTime = safe;
			setProgress(safe);
		},
		[duration]
	);

	// --- Audio element event wiring -----------------------------------------
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => setProgress(audio.currentTime);
		const handleLoadedMetadata = () => setDuration(audio.duration || 0);

		const handlePositionPersist = () => {
			if (!currentFile) return;
			const seconds = Math.floor(audio.currentTime);
			if (positionsRef.current[currentFile.path] === seconds) return;
			const nextPositions = {
				...positionsRef.current,
				[currentFile.path]: seconds,
			};
			positionsRef.current = nextPositions;
			savePosition(nextPositions);
		};

		const handleEnded = () => {
			if (!hasTracks) return;

			if (repeatMode === "one") {
				audio.currentTime = 0;
				audio.play().catch((err) => console.error("Unable to replay", err));
				return;
			}

			if (shuffleEnabled) {
				setCurrentIndex((prev) => getRandomIndex(files.length, prev));
				return;
			}

			const isLast = currentIndex >= files.length - 1;
			if (!isLast) {
				setCurrentIndex((prev) => prev + 1);
				return;
			}

			if (repeatMode === "all") {
				setCurrentIndex(0);
				return;
			}

			setIsPlaying(false);
		};

		const handlePlay = () => setIsPlaying(true);
		const handlePause = () => setIsPlaying(false);

		audio.addEventListener("timeupdate", handleTimeUpdate);
		audio.addEventListener("loadedmetadata", handleLoadedMetadata);
		audio.addEventListener("timeupdate", handlePositionPersist);
		audio.addEventListener("ended", handleEnded);
		audio.addEventListener("play", handlePlay);
		audio.addEventListener("pause", handlePause);

		return () => {
			audio.removeEventListener("timeupdate", handleTimeUpdate);
			audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
			audio.removeEventListener("timeupdate", handlePositionPersist);
			audio.removeEventListener("ended", handleEnded);
			audio.removeEventListener("play", handlePlay);
			audio.removeEventListener("pause", handlePause);
		};
	}, [
		currentFile,
		currentIndex,
		files.length,
		hasTracks,
		repeatMode,
		shuffleEnabled,
	]);

	// --- Load and play when selection changes --------------------------------
	useEffect(() => {
		const audio = audioRef.current;
		const track = currentFile;

		if (!audio || !track) {
			setIsPlaying(false);
			setProgress(0);
			setDuration(0);
			audio?.pause();
			return;
		}

		const loadAndPlay = async () => {
			const requestId = ++loadRequestRef.current;
			try {
				audio.pause();
				const src: string = await window.ipcRenderer.invoke(
					"load-audio-file",
					track.path
				);
				if (requestId !== loadRequestRef.current) return;

				audio.src = src;
				audio.currentTime = 0;
				audio.load();

				if (audio.readyState < 1) {
					await new Promise<void>((resolve) =>
						audio.addEventListener("loadedmetadata", () => resolve(), {
							once: true,
						})
					);
				}

				const saved = positionsRef.current[track.path];
				if (saved) {
					const safe = Math.min(saved, audio.duration || saved);
					audio.currentTime = safe;
					setProgress(safe);
				}

				await audio.play();
				setIsPlaying(true);
			} catch (err) {
				console.error("Error loading audio:", err);
				setIsPlaying(false);
			}
		};

		loadAndPlay();
	}, [currentFile]);

	return useMemo(
		() => ({
			files,
			currentFile,
			currentIndex,
			isPlaying,
			progress,
			duration,
			hasTracks,
			volume,
			isMuted,
			shuffleEnabled,
			repeatMode,
			addFiles,
			selectFile,
			playNext,
			playPrevious,
			togglePlayPause,
			seek,
			setVolumeLevel,
			toggleMute,
			toggleShuffle,
			toggleRepeatMode,
		}),
		[
			addFiles,
			currentFile,
			currentIndex,
			duration,
			files,
			hasTracks,
			isMuted,
			isPlaying,
			playNext,
			playPrevious,
			progress,
			repeatMode,
			selectFile,
			setVolumeLevel,
			shuffleEnabled,
			toggleMute,
			togglePlayPause,
			toggleRepeatMode,
			toggleShuffle,
			volume,
		]
	);
}
