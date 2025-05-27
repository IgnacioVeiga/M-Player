import { ILyricsTag } from 'music-metadata';

export type ArtworkSize = 'large' | 'thumbnail';

export interface AudioFile {
  title: string;
  artist: string;
  album: string;
  duration: number;
  lyrics: ILyricsTag[];
  path: string;
  image: string | null;
}

export interface SidebarItem {
  icon: string;
  label: string;
  onClick: (() => void) | null;
}

export type ControlsProps = {
	file: AudioFile;
	onPrevious: () => void;
	onNext: () => void;
	onPlayPause: () => void;
	isPlaying: boolean;
	audioRef: React.RefObject<HTMLAudioElement>;
	progress: number;
	duration: number;
	onProgressChange: (value: number) => void;
};
    
export interface FileListProps {
	files: AudioFile[];
	file?: AudioFile;
	onFileSelect: (file: AudioFile) => void;
}

export interface SidebarProps {
	isOpen: boolean;
	toggleSidebar: () => void;
	onFilesSelected: (files: AudioFile[]) => void;
}

export interface LyricsProps {
	file?: AudioFile;
}

export type NavbarProps = {
	onMenuClick: () => void;
};

export interface PlaylistProps {
    files: AudioFile[];
    file: AudioFile;
    onFileSelect: (file: AudioFile) => void;
}

// Define the Tab enum to represent the different tabs
export enum Tab {
    UP_NEXT = "UP_NEXT",
    LYRICS = "LYRICS",
    RELATED = "RELATED",
}

export type ProgressBarProps = {
    progress: number;
    duration: number;
    onProgressChange: (value: number) => void;
};