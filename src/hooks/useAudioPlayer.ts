import { useEffect, useRef, useState, useCallback } from "react";
import { AudioFile, RepeatMode } from "@/types";

const QUEUE_STORAGE_KEY = "m-player:queue";
const SETTINGS_STORAGE_KEY = "m-player:settings";
const POSITIONS_STORAGE_KEY = "m-player:positions";

type PersistedQueue = {
	paths: string[];
	currentIndex: number;
};

type PersistedSettings = {
	volume: number;
	isMuted: boolean;
	shuffleEnabled: boolean;
	repeatMode: RepeatMode;
};

type PositionMap = Record<string, number>;

const clampVolume = (value: number): number => Math.min(1, Math.max(0, value));

const isRepeatMode = (value: unknown): value is RepeatMode =>
	value === "off" || value === "all" || value === "one";

/**
 * Centralized audio/queue controller.
 * Keeps the <audio> element outside the React tree so components stay presentational.
 * If you come from Angular: think of this as a service that holds state + side effects,
 * and components subscribe via the returned values/functions.
 */
export default function useAudioPlayer() {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const loadRequestRef = useRef<number>(0);
	const positionsRef = useRef<PositionMap>({});
	const [files, setFiles] = useState<AudioFile[]>([]);
	const [currentIndex, setCurrentIndex] = useState<number>(-1);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);
	const [volume, setVolume] = useState<number>(1);
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const [shuffleEnabled, setShuffleEnabled] = useState<boolean>(false);
	const [repeatMode, setRepeatMode] = useState<RepeatMode>("all");
	const [hasRestoredQueue, setHasRestoredQueue] = useState<boolean>(false);
	const [hasRestoredSettings, setHasRestoredSettings] = useState<boolean>(false);

	// Ensure the audio element exists exactly once.
	if (!audioRef.current) {
		const audio = new Audio();
		audio.preload = "auto";
		audioRef.current = audio;
	}

	const hasTracks = files.length > 0;
	const currentFile = currentIndex >= 0 ? files[currentIndex] : undefined;

	// Restore saved positions once at startup.
	useEffect(() => {
		try {
			const raw = window.localStorage.getItem(POSITIONS_STORAGE_KEY);
			if (!raw) return;
			const parsed = JSON.parse(raw) as PositionMap;
			if (parsed && typeof parsed === "object") {
				positionsRef.current = parsed;
			}
		} catch (err) {
			console.error("Unable to restore track positions", err);
		}
	}, []);

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

	const setVolumeLevel = useCallback((nextVolume: number) => {
		const safeVolume = clampVolume(nextVolume);
		setVolume(safeVolume);
		setIsMuted(safeVolume === 0);
	}, []);

	const toggleMute = useCallback(() => {
		setIsMuted((prev) => !prev);
	}, []);

	const toggleShuffle = useCallback(() => {
		setShuffleEnabled((prev) => !prev);
	}, []);

	const toggleRepeatMode = useCallback(() => {
		setRepeatMode((prev) => {
			if (prev === "all") return "one";
			if (prev === "one") return "off";
			return "all";
		});
	}, []);

	const getRandomIndex = useCallback(
		(currentTrackIndex: number) => {
			if (files.length <= 1) return currentTrackIndex >= 0 ? currentTrackIndex : 0;
			let nextIndex = currentTrackIndex;
			while (nextIndex === currentTrackIndex) {
				nextIndex = Math.floor(Math.random() * files.length);
			}
			return nextIndex;
		},
		[files.length]
	);

	const play = useCallback(async () => {
		if (!audioRef.current || !currentFile) return;
		try {
			if (audioRef.current.ended) {
				audioRef.current.currentTime = 0;
			}
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
			if (shuffleEnabled) return getRandomIndex(prev);
			return (prev + 1) % files.length;
		});
	}, [files.length, getRandomIndex, hasTracks, shuffleEnabled]);

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

	// Restore playback settings on startup.
	useEffect(() => {
		try {
			const rawSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
			if (!rawSettings) {
				setHasRestoredSettings(true);
				return;
			}

			const parsed = JSON.parse(rawSettings) as Partial<PersistedSettings>;
			if (typeof parsed.volume === "number") setVolume(clampVolume(parsed.volume));
			if (typeof parsed.isMuted === "boolean") setIsMuted(parsed.isMuted);
			if (typeof parsed.shuffleEnabled === "boolean") {
				setShuffleEnabled(parsed.shuffleEnabled);
			}
			if (isRepeatMode(parsed.repeatMode)) setRepeatMode(parsed.repeatMode);
		} catch (err) {
			console.error("Unable to restore player settings", err);
		} finally {
			setHasRestoredSettings(true);
		}
	}, []);

	// Restore queue from file paths (metadata is rebuilt through IPC).
	useEffect(() => {
		let isActive = true;

		const restoreQueue = async () => {
			try {
				const rawQueue = window.localStorage.getItem(QUEUE_STORAGE_KEY);
				if (!rawQueue) return;

				const parsed = JSON.parse(rawQueue) as Partial<PersistedQueue>;
				if (!Array.isArray(parsed.paths) || parsed.paths.length === 0) return;

				const restoredFiles: AudioFile[] = await window.ipcRenderer.invoke(
					"load-audio-metadata",
					parsed.paths
				);

				if (!isActive || restoredFiles.length === 0) return;

				setFiles(restoredFiles);

				const requestedIndex =
					typeof parsed.currentIndex === "number" ? parsed.currentIndex : 0;
				const safeIndex = Math.min(
					Math.max(requestedIndex, 0),
					restoredFiles.length - 1
				);
				setCurrentIndex(safeIndex);
			} catch (err) {
				console.error("Unable to restore queue", err);
			} finally {
				if (isActive) setHasRestoredQueue(true);
			}
		};

		restoreQueue();

		return () => {
			isActive = false;
		};
	}, []);

	// Persist queue references and player preferences.
	useEffect(() => {
		if (!hasRestoredQueue) return;

		const queuePayload: PersistedQueue = {
			paths: files.map((file) => file.path),
			currentIndex,
		};
		window.localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queuePayload));
	}, [currentIndex, files, hasRestoredQueue]);

	useEffect(() => {
		if (!hasRestoredSettings) return;

		const settingsPayload: PersistedSettings = {
			volume,
			isMuted,
			shuffleEnabled,
			repeatMode,
		};
		window.localStorage.setItem(
			SETTINGS_STORAGE_KEY,
			JSON.stringify(settingsPayload)
		);
	}, [hasRestoredSettings, isMuted, repeatMode, shuffleEnabled, volume]);

	// Keep HTMLAudioElement in sync with UI audio settings.
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;
		audio.volume = volume;
		audio.muted = isMuted;
	}, [isMuted, volume]);

	// Bind audio events and keep "ended" behavior in sync with current playback mode.
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleTimeUpdate = () => setProgress(audio.currentTime);
		const handleLoadedMetadata = () => setDuration(audio.duration || 0);
		const handlePositionPersist = () => {
			if (!currentFile) return;
			const seconds = Math.floor(audio.currentTime);
			const existing = positionsRef.current[currentFile.path];
			if (existing === seconds) return;
			positionsRef.current = {
				...positionsRef.current,
				[currentFile.path]: seconds,
			};
			window.localStorage.setItem(
				POSITIONS_STORAGE_KEY,
				JSON.stringify(positionsRef.current)
			);
		};
		const handleEnded = () => {
			if (!hasTracks) return;

			if (repeatMode === "one") {
				audio.currentTime = 0;
				audio.play().catch((err) => {
					console.error("Unable to replay current track", err);
				});
				return;
			}

			if (shuffleEnabled) {
				setCurrentIndex((prev) => getRandomIndex(prev));
				return;
			}

			const isLastTrack = currentIndex >= files.length - 1;
			if (!isLastTrack) {
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
		currentIndex,
		files.length,
		getRandomIndex,
		hasTracks,
		repeatMode,
		shuffleEnabled,
	]);

	// Load audio when the current selection changes.
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
				// Stop current playback before swapping source to avoid overlap artifacts.
				audio.pause();

				const src: string = await window.ipcRenderer.invoke(
					"load-audio-file",
					track.path
				);

				// Ignore stale async loads when user jumps quickly across tracks.
				if (requestId !== loadRequestRef.current) return;

				audio.src = src;
				audio.currentTime = 0;
				audio.load();
				setProgress(0);

				// Wait for metadata before seeking to a saved position.
				if (audio.readyState < 1) {
					await new Promise<void>((resolve) =>
						audio.addEventListener("loadedmetadata", () => resolve(), {
							once: true,
						})
					);
				}

				const savedPosition = positionsRef.current[track.path];
				if (savedPosition) {
					const safePosition = Math.min(savedPosition, audio.duration || savedPosition);
					audio.currentTime = safePosition;
					setProgress(safePosition);
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

	return {
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
	};
}
