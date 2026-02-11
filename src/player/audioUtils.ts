import { RepeatMode } from "@/types";

export const clampVolume = (value: number): number =>
	Math.min(1, Math.max(0, value));

export const isRepeatMode = (value: unknown): value is RepeatMode =>
	value === "off" || value === "all" || value === "one";

export const getRandomIndex = (length: number, currentIndex: number): number => {
	if (length <= 1) return currentIndex >= 0 ? currentIndex : 0;
	let nextIndex = currentIndex;
	while (nextIndex === currentIndex) {
		nextIndex = Math.floor(Math.random() * length);
	}
	return nextIndex;
};

export const createAudioElement = (): HTMLAudioElement => {
	const audio = new Audio();
	audio.preload = "auto";
	return audio;
};
