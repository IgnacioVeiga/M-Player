import { useMemo, useState } from "react";
import { JSX } from "react/jsx-runtime";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Artwork from "@/components/Artwork";
import Playlist from "@/components/Playlist";
import Controls from "@/components/Controls";
import useAudioPlayer from "@/hooks/useAudioPlayer";

export default function App(): JSX.Element {
	// UI-only state (not tied to audio)
	const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
	const [searchQuery, setSearchQuery] = useState<string>("");

	// Shared player state + actions live in a dedicated hook.
	const {
		files,
		currentFile,
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
	} = useAudioPlayer();

	const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
	const normalizedQuery = searchQuery.trim().toLowerCase();

	// Keep filtering logic in App so Playlist remains a pure rendering component.
	const filteredFiles = useMemo(() => {
		if (!normalizedQuery) return files;

		return files.filter((file) => {
			const title = file.title?.toLowerCase() ?? "";
			const artist = file.artist?.toLowerCase() ?? "";
			const album = file.album?.toLowerCase() ?? "";
			return (
				title.includes(normalizedQuery) ||
				artist.includes(normalizedQuery) ||
				album.includes(normalizedQuery)
			);
		});
	}, [files, normalizedQuery]);

	const emptyMessage = normalizedQuery
		? "No tracks found for your search."
		: "No tracks loaded yet. Use the left menu to add music files.";

	return (
		<div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
			<Navbar
				onMenuClick={toggleSidebar}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>
			<Sidebar
				onFilesSelected={addFiles}
				isOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>

			<div className="grid lg:grid-cols-[2fr_1.5fr] gap-4 sm:grid-cols-[1fr] sm:gap-0">
				<Artwork file={currentFile} />
				<Playlist
					files={filteredFiles}
					file={currentFile}
					onFileSelect={selectFile}
					emptyMessage={emptyMessage}
				/>
			</div>

			<Controls
				file={currentFile}
				onPrevious={playPrevious}
				onNext={playNext}
				onPlayPause={togglePlayPause}
				isPlaying={isPlaying}
				isMuted={isMuted}
				volume={volume}
				shuffleEnabled={shuffleEnabled}
				repeatMode={repeatMode}
				progress={progress}
				duration={duration}
				onProgressChange={seek}
				onToggleMute={toggleMute}
				onVolumeChange={setVolumeLevel}
				onToggleShuffle={toggleShuffle}
				onToggleRepeat={toggleRepeatMode}
			/>

			{!hasTracks && (
				<div className="fixed inset-0 flex items-center justify-center pointer-events-none text-neutral-500">
					Use the menu to add music files and start playing.
				</div>
			)}
		</div>
	);
}
