import { useState } from "react";
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

	// Shared player state + actions live in a dedicated hook.
	const {
		files,
		currentFile,
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
	} = useAudioPlayer();

	const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

	return (
		<div className="grid min-h-dvh grid-rows-[auto_1fr_auto]">
			<Navbar onMenuClick={toggleSidebar} />
			<Sidebar
				onFilesSelected={addFiles}
				isOpen={isSidebarOpen}
				toggleSidebar={toggleSidebar}
			/>

			<div className="grid lg:grid-cols-[2fr_1.5fr] gap-4 sm:grid-cols-[1fr] sm:gap-0">
				<Artwork file={currentFile} />
				<Playlist
					files={files}
					file={currentFile}
					onFileSelect={selectFile}
				/>
			</div>

			<Controls
				file={currentFile}
				onPrevious={playPrevious}
				onNext={playNext}
				onPlayPause={togglePlayPause}
				isPlaying={isPlaying}
				progress={progress}
				duration={duration}
				onProgressChange={seek}
			/>

			{!hasTracks && (
				<div className="fixed inset-0 flex items-center justify-center pointer-events-none text-neutral-500">
					Use the menu to add music files and start playing.
				</div>
			)}
		</div>
	);
}
