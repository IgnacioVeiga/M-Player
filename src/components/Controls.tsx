import ProgressBar from "./ProgressBar";
import Artwork from "./Artwork";
import { ControlsProps } from "@/types";
import { JSX } from "react/jsx-runtime";

export default function Controls({
	file,
	onPrevious,
	onNext,
	onPlayPause,
	onToggleMute,
	onVolumeChange,
	onToggleShuffle,
	onToggleRepeat,
	isPlaying,
	isMuted,
	volume,
	shuffleEnabled,
	repeatMode,
	progress,
	duration,
	onProgressChange,
}: ControlsProps): JSX.Element {
	const hasTrack = Boolean(file);

	// Tiny helper to keep minutes:seconds readable.
	const formatTime = (time: number) => {
		const minutes = Math.floor(time / 60);
		const seconds = Math.floor(time % 60)
			.toString()
			.padStart(2, "0");
		return `${minutes}:${seconds}`;
	};

	const volumeIcon = isMuted || volume === 0
		? "volume_off"
		: volume < 0.5
			? "volume_down"
			: "volume_up";
	const repeatIcon = repeatMode === "one" ? "repeat_one" : "repeat";
	const repeatClass =
		repeatMode === "off" ? "text-white" : "text-primary";
	const shuffleClass = shuffleEnabled ? "text-primary" : "text-white";

	return (
		<div className="fixed bottom-0 w-full">
			<ProgressBar
				progress={progress}
				duration={duration}
				onProgressChange={onProgressChange}
			/>
			<footer className="flex items-center justify-between bg-[#121212] p-3">
				{/* Left controls */}
				<div className="flex items-center gap-2">
					<button
						disabled={!hasTrack}
						onClick={onPrevious}
						className="text-white cursor-pointer text-2xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span className="material-icons">skip_previous</span>
					</button>
					<button
						disabled={!hasTrack}
						onClick={onPlayPause}
						className="text-white cursor-pointer text-2xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isPlaying ? (
							<span className="material-icons">pause</span>
						) : (
							<span className="material-icons">play_arrow</span>
						)}
					</button>
					<button
						disabled={!hasTrack}
						onClick={onNext}
						className="text-white cursor-pointer text-2xl hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span className="material-icons">skip_next</span>
					</button>

					<span className="text-sm text-neutral-400">
						{formatTime(progress)} / {formatTime(duration)}
					</span>
				</div>

				{/* Metadata */}
				<div className="flex items-center gap-3">
					<Artwork
						file={file}
						size="thumbnail"
					/>
					<div className="flex flex-col my-4">
						<span>{file?.title || "Unknown Title"}</span>
						<span className="text-neutral-400 text-sm hover:underline cursor-pointer">
							{file?.artist || "Unknown Artist"} -{" "}
							{file?.album || "Unknown Album"}
						</span>
					</div>
				</div>

				{/* Right controls */}
				<div className="flex items-center gap-2">
					<button
						disabled={!hasTrack}
						onClick={onToggleMute}
						className="text-white cursor-pointer hover:scale-105 text-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<span className="material-icons-outlined">{volumeIcon}</span>
					</button>
					<input
						type="range"
						min="0"
						max="1"
						step="0.01"
						value={isMuted ? 0 : volume}
						onChange={(event) => onVolumeChange(parseFloat(event.target.value))}
						disabled={!hasTrack}
						className="w-20 accent-primary disabled:opacity-50"
					/>
					<button
						disabled={!hasTrack}
						onClick={onToggleRepeat}
						className={`${repeatClass} cursor-pointer hover:scale-105 text-2xl transition disabled:opacity-50 disabled:cursor-not-allowed`}
						title={`Repeat mode: ${repeatMode}`}
					>
						<span className="material-icons">{repeatIcon}</span>
					</button>
					<button
						disabled={!hasTrack}
						onClick={onToggleShuffle}
						className={`${shuffleClass} cursor-pointer hover:scale-105 text-2xl transition disabled:opacity-50 disabled:cursor-not-allowed`}
						title={`Shuffle: ${shuffleEnabled ? "on" : "off"}`}
					>
						<span className="material-icons">shuffle</span>
					</button>
				</div>
			</footer>
		</div>
	);
}
