import { ArtworkSize, AudioFile } from "@/types";
import { JSX } from "react/jsx-runtime";

export default function Artwork({
	file,
	size = "large",
}: {
	file?: AudioFile;
	size?: ArtworkSize;
}): JSX.Element {
	// Default to "large" if size is not provided
	const isThumbnail = size === "thumbnail";
	const imageClasses = isThumbnail
		? "h-full w-full object-cover"
		: "w-full h-full object-contain rounded-2xl shadow-2xl bg-transparent";

	return (
		<div
			className={
				isThumbnail
					? "flex-none w-12 h-12 mr-3 overflow-hidden rounded-md bg-[#1f1f1f]"
					: "relative flex items-center justify-center px-2 lg:px-4 h-full"
			}
		>
			<div className="w-full max-w-[960px] h-[min(78vh,820px)] sm:h-[min(82vh,880px)] flex items-center justify-center">
				{file?.image ? (
					<img
						src={file.image}
						alt="Album Art"
						className={imageClasses}
					/>
				) : (
					<div className="w-full h-full aspect-square flex items-center justify-center text-center text-sm text-white bg-gradient-to-br from-[#2a2a2a] to-[#111] rounded-2xl border border-[#2f2f2f]">
						No Image
					</div>
				)}
			</div>
		</div>
	);
}
