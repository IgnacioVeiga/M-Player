import { ArtworkSize, AudioFile } from "@/types";
import { JSX } from "react/jsx-runtime";

export default function Artwork({ file, size = 'large' }: { file: AudioFile; size?: ArtworkSize }): JSX.Element {
	// Default to "large" if size is not provided
	const isThumbnail = size === "thumbnail";
	const imageClasses = isThumbnail ? "h-full" : "max-w-[80vw] max-h-[90%] rounded-2xl";

	return (
		<div
			className={
				isThumbnail
					? "flex-none w-12 h-12 mr-3"
					: "h-[calc(100vh-160px)] mt-16 flex items-center justify-center"
			}
		>
			{file?.image ? (
				<img
					src={file.image}
					alt="Album Art"
					className={imageClasses}
				/>
			) : (
				<div className="h-full w-auto aspect-[1/1] flex items-center justify-center text-center text-xs text-white bg-neutral-700 rounded-2xl">
					No Image
				</div>
			)}
		</div>
	);
}
