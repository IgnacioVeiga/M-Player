import { FileListProps } from "@/types";
import Artwork from "./Artwork";
import { JSX } from "react/jsx-runtime";

export default function FileList({ files, file, onFileSelect }: FileListProps): JSX.Element {
	return (
		<ul className="list-none p-0 m-0 overflow-y-auto overflow-x-hidden">
			{files.map((f, index) => (
				<li
					key={index}
					onClick={() => onFileSelect(f)}
					className={`flex justify-between items-center select-none px-4 py-2 border-y border-neutral-800 cursor-pointer transition-colors
            					${file?.path === f.path
								? "bg-neutral-800 font-medium border-l-primary border-2"
								: ""} hover:bg-neutral-700`} >
					
					<div className="flex items-center gap-3">
						<Artwork file={f} size="thumbnail" />

						<div className="flex flex-col">
							<span>{f.title}</span>
							<span className="text-xs text-neutral-400 truncate">
								{f.artist || "Unknown Artist"}
							</span>
						</div>
					</div>
				</li>
			))}
		</ul>
	);
}
