import { AudioFile, RepeatMode } from "@/types";

export type PersistedQueue = {
	paths: string[];
	currentIndex: number;
};

export type PersistedSettings = {
	volume: number;
	isMuted: boolean;
	shuffleEnabled: boolean;
	repeatMode: RepeatMode;
};

export type PositionMap = Record<string, number>;

const QUEUE_KEY = "m-player:queue";
const SETTINGS_KEY = "m-player:settings";
const POSITIONS_KEY = "m-player:positions";

export const loadSettings = (): Partial<PersistedSettings> | null => {
	try {
		const raw = window.localStorage.getItem(SETTINGS_KEY);
		return raw ? (JSON.parse(raw) as Partial<PersistedSettings>) : null;
	} catch (err) {
		console.error("Unable to restore player settings", err);
		return null;
	}
};

export const saveSettings = (settings: PersistedSettings): void => {
	try {
		window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
	} catch (err) {
		console.error("Unable to persist player settings", err);
	}
};

export const loadQueue = (): Partial<PersistedQueue> | null => {
	try {
		const raw = window.localStorage.getItem(QUEUE_KEY);
		return raw ? (JSON.parse(raw) as Partial<PersistedQueue>) : null;
	} catch (err) {
		console.error("Unable to restore queue", err);
		return null;
	}
};

export const saveQueue = (queue: PersistedQueue): void => {
	try {
		window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
	} catch (err) {
		console.error("Unable to persist queue", err);
	}
};

export const loadPositions = (): PositionMap => {
	try {
		const raw = window.localStorage.getItem(POSITIONS_KEY);
		return raw ? (JSON.parse(raw) as PositionMap) : {};
	} catch (err) {
		console.error("Unable to restore track positions", err);
		return {};
	}
};

export const savePosition = (positions: PositionMap): void => {
	try {
		window.localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
	} catch (err) {
		console.error("Unable to persist track positions", err);
	}
};
