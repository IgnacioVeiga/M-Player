import { useEffect, useMemo, useState } from "react";
import { JSX } from "react/jsx-runtime";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Artwork from "@/components/Artwork";
import Playlist from "@/components/Playlist";
import Controls from "@/components/Controls";
import useAudioPlayer from "@/hooks/useAudioPlayer";

export default function App(): JSX.Element {
	// UI-only state (not tied to audio)
	const [isSidebarPinned, setIsSidebarPinned] = useState<boolean>(true);
	const [isDesktop, setIsDesktop] = useState<boolean>(false);
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
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

	const normalizedQuery = searchQuery.trim().toLowerCase();

	// Keep sidebar pinned on desktop, toggle on mobile.
	useEffect(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
			const desktop = "matches" in e ? e.matches : e.matches;
			setIsDesktop(desktop);
			if (!desktop) {
				// close mobile drawer when leaving desktop
				setIsMobileSidebarOpen(false);
			}
		};
		handleChange(mq);
		mq.addEventListener("change", handleChange as EventListener);
		return () => mq.removeEventListener("change", handleChange as EventListener);
	}, []);

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

	// Global keyboard shortcuts (ignored while typing in inputs/textareas/contentEditable).
	useEffect(() => {
		const isTypingElement = (target: EventTarget | null) => {
			if (!(target instanceof HTMLElement)) return false;
			const tag = target.tagName.toLowerCase();
			return (
				tag === "input" ||
				tag === "textarea" ||
				tag === "select" ||
				target.isContentEditable
			);
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (isTypingElement(event.target)) return;

			switch (event.key) {
				case " ":
					event.preventDefault();
					togglePlayPause();
					break;
				case "ArrowRight":
					event.preventDefault();
					seek(progress + 5);
					break;
				case "ArrowLeft":
					event.preventDefault();
					seek(Math.max(0, progress - 5));
					break;
				case "ArrowUp":
					event.preventDefault();
					setVolumeLevel(Math.min(1, volume + 0.05));
					break;
				case "ArrowDown":
					event.preventDefault();
					setVolumeLevel(Math.max(0, volume - 0.05));
					break;
				case "m":
				case "M":
					toggleMute();
					break;
				case "s":
				case "S":
					toggleShuffle();
					break;
				case "r":
				case "R":
					toggleRepeatMode();
					break;
				case "n":
				case "N":
					playNext();
					break;
				case "p":
				case "P":
					playPrevious();
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [
		playNext,
		playPrevious,
		progress,
		seek,
		setVolumeLevel,
		toggleMute,
		togglePlayPause,
		toggleRepeatMode,
		toggleShuffle,
		volume,
	]);

	const sidebarOpen = isDesktop ? isSidebarPinned : isMobileSidebarOpen;
	const sidebarWidth = isDesktop && sidebarOpen ? 260 : 0;

	const handleMenuClick = () => {
		if (isDesktop) setIsSidebarPinned((prev) => !prev);
		else setIsMobileSidebarOpen((prev) => !prev);
	};

	const mainScrollClass = isDesktop
		? "h-[calc(100vh-76px)] overflow-hidden"
		: "min-h-[calc(100vh-76px)] overflow-y-auto";

	return (
		<div className="min-h-screen bg-transparent overflow-hidden">
			<Navbar
				onMenuClick={handleMenuClick}
				searchQuery={searchQuery}
				onSearchChange={setSearchQuery}
			/>
			<div
				className="lg:grid"
				style={
					isDesktop
						? { gridTemplateColumns: `${sidebarWidth}px 1fr`, transition: "grid-template-columns 200ms ease" }
						: undefined
				}
			>
				<Sidebar
					onFilesSelected={addFiles}
					isOpen={sidebarOpen}
					toggleSidebar={handleMenuClick}
					width={sidebarWidth}
					isDesktop={isDesktop}
				/>

				<main className={`pt-[76px] pb-[120px] px-3 sm:px-5 lg:px-6 ${mainScrollClass}`}>
					<div className="grid lg:grid-cols-[minmax(340px,1.2fr)_minmax(340px,1fr)] gap-4 xl:gap-6 h-full">
						<div className="h-full flex items-start justify-center">
							<Artwork file={currentFile} />
						</div>
						<div className="h-full">
							<Playlist
								files={filteredFiles}
								file={currentFile}
								onFileSelect={selectFile}
								emptyMessage={emptyMessage}
							/>
						</div>
					</div>
				</main>
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
