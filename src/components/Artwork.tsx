export default function Artwork({ file, size = "large" }: { file: any; size?: "large" | "thumbnail" }) {
	// Default to "large" if size is not provided
	const isThumbnail = size === "thumbnail";

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
					className={
						isThumbnail
							? "h-full"
							: "max-w-[80vw] max-h-[90%] rounded-2xl"
					}
				/>
			) : (
				<div className="w-full h-full flex items-center justify-center text-center text-xs text-white bg-neutral-700 rounded-2xl">
					No Image
				</div>
			)}
		</div>
	);
}
