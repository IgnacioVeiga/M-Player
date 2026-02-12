import { useRef, useState } from "react";
import FileList from "./FileList";
import Lyrics from "./Lyrics";
import { PlaylistProps, Tab } from "@/types";
import { JSX } from "react/jsx-runtime";

export default function Playlist({
	files,
	file,
	onFileSelect,
	emptyMessage,
}: PlaylistProps): JSX.Element {
	const [activeTab, setActiveTab] = useState(Tab.UP_NEXT);
	const contentRef = useRef<HTMLDivElement | null>(null);

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
						emptyMessage={emptyMessage}
					/>
				);
		}
	};

	const handleTabChange = (tab: Tab) => {
		setActiveTab(tab);
		if (contentRef.current) {
			contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<div className="flex flex-col glass-panel rounded-2xl border border-[#2f2f2f] h-[auto] lg:h-[calc(100vh-220px)] max-h-[calc(100vh-220px)]">
			<div className="flex justify-around p-2 border-b border-[#2f2f2f] sticky top-0 bg-[#181818]/80 backdrop-blur-md rounded-t-2xl">
				{Object.values(Tab).map((tab) => (
					<button
						key={tab}
						onClick={() => handleTabChange(tab)}
						className={`text-sm px-3 py-2 rounded-full transition ${
							activeTab === tab
								? "text-white bg-[#2a2a2a]"
								: "text-neutral-400 hover:text-white hover:bg-[#222]"
						}`}
					>
						{tab.replace("_", " ")}
					</button>
				))}
			</div>
			<div ref={contentRef} className="flex-1 overflow-y-auto">
				{renderContent()}
			</div>
		</div>
	);
}
