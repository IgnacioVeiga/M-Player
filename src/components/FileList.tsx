import { FileListProps } from "@/types";
import Artwork from "./Artwork";
import { JSX } from "react/jsx-runtime";

export default function FileList({
	files,
	file,
	onFileSelect,
	emptyMessage = "No tracks loaded yet. Use the left menu to add music files.",
}: FileListProps): JSX.Element {
	if (files.length === 0) {
		return (
			<div className="p-6 text-center text-neutral-400">{emptyMessage}</div>
		);
	}

	return (
		<ul className="list-none p-0 m-0 overflow-y-auto overflow-x-hidden divide-y divide-[#2a2a2a]">
			{files.map((f, index) => {
				const isActive = file?.path === f.path;
				return (
					<li
						key={index}
						onClick={() => onFileSelect(f)}
						className={`flex items-center gap-3 select-none px-4 py-3 cursor-pointer transition ${
							isActive
								? "bg-[#202020] border-l-4 border-l-primary"
								: "hover:bg-[#1d1d1d]"
						}`}
					>
						<span className="w-6 text-center text-neutral-500 text-sm">
							{index + 1}
						</span>
						<Artwork file={f} size="thumbnail" />
						<div className="flex flex-col flex-1 min-w-0">
							<span className="truncate text-sm font-medium text-white">
								{f.title}
							</span>
							<span className="text-xs text-neutral-400 truncate">
								{f.artist || "Unknown Artist"} • {f.album || "Unknown Album"}
							</span>
						</div>
						<span className="text-xs text-neutral-500">
							{Math.floor(f.duration / 60)
								.toString()
								.padStart(1, "0")}
							:
							{Math.floor(f.duration % 60)
								.toString()
								.padStart(2, "0")}
						</span>
					</li>
				);
			})}
		</ul>
	);
}
