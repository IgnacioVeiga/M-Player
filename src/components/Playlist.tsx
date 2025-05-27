import { useState } from "react";
import FileList from "./FileList";
import Lyrics from "./Lyrics";
import { PlaylistProps, Tab } from "@/types";
import { JSX } from "react/jsx-runtime";

export default function Playlist({ files, file, onFileSelect }: PlaylistProps): JSX.Element {
	const [activeTab, setActiveTab] = useState(Tab.UP_NEXT);

	const renderContent = () => {
		switch (activeTab) {
			case Tab.LYRICS:
				return <Lyrics file={file} />;
			case Tab.RELATED:
				return <div className="px-5 py-0 text-center whitespace-break-spaces">No related content available</div>;
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
		<div className="flex flex-col mt-[72px]">
			<div className="flex justify-around p-2 border-b border-neutral-800">
				{Object.values(Tab).map((tab) => (
					<button
						key={tab}
						onClick={() => setActiveTab(tab)}
						className={`text-sm text-neutral-400 hover:text-white ${
							activeTab === tab
								? "text-white border-b-2 border-white"
								: "cursor-pointer"
						}`}
					>
						{tab.replace("_", " ")}
					</button>
				))}
			</div>
			<div className="h-[85%] overflow-y-auto">{renderContent()}</div>
		</div>
	);
}
