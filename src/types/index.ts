import { ILyricsTag } from 'music-metadata';

export type ArtworkSize = 'large' | 'thumbnail';
export type RepeatMode = 'off' | 'all' | 'one';

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
    file?: AudioFile;
    onPrevious: () => void;
    onNext: () => void;
    onPlayPause: () => void;
    onToggleMute: () => void;
    onVolumeChange: (value: number) => void;
    onToggleShuffle: () => void;
    onToggleRepeat: () => void;
    isPlaying: boolean;
    isMuted: boolean;
    volume: number;
    shuffleEnabled: boolean;
    repeatMode: RepeatMode;
    progress: number;
    duration: number;
    onProgressChange: (value: number) => void;
};
    
export interface FileListProps {
	files: AudioFile[];
	file?: AudioFile;
	onFileSelect: (file: AudioFile) => void;
    emptyMessage?: string;
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
    searchQuery: string;
    onSearchChange: (value: string) => void;
};

export interface PlaylistProps {
    files: AudioFile[];
    file?: AudioFile;
    onFileSelect: (file: AudioFile) => void;
    emptyMessage?: string;
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
