import { useState } from "react";
import FileList from "./FileList";
import Lyrics from "./Lyrics";

interface PlaylistProps {
	files: any[]; // Replace 'any[]' with the actual file type if available
	file: any;    // Replace 'any' with the actual file type if available
	onFileSelect: (file: any) => void; // Adjust the parameter type as needed
}

export default function Playlist({ files, file, onFileSelect }: PlaylistProps) {
	const [activeTab, setActiveTab] = useState("UP_NEXT");

	const renderContent = () => {
		switch (activeTab) {
			case "LYRICS":
				return <Lyrics file={file} />;
			case "RELATED":
				return <div>Related content here...</div>;
			default:
				return (
					<FileList
						files={files}
						file={file}
						onFileSelect={onFileSelect}
					/>
				);
		}
	};

	return (
		<div className="flex flex-col mt-[72px] mb-[100px]">
			<div className="flex justify-around p-2 border-b border-neutral-800">
				{["UP_NEXT", "LYRICS", "RELATED"].map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`text-sm text-neutral-400 hover:text-white ${
							activeTab === tab ? "text-white border-b-2 border-white" : "cursor-pointer"
						}`}
					>
						{tab.replace("_", " ")}
					</button>
				))}
			</div>
			<div className="overflow-y-auto">{renderContent()}</div>
		</div>
	);
}
