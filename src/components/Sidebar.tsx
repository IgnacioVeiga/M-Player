import { SidebarProps } from "@/types";
import { JSX } from "react/jsx-runtime";

export default function Sidebar({
	isOpen,
	toggleSidebar,
	onFilesSelected,
}: SidebarProps): JSX.Element {
	const handleSelectFiles = async () => {
		const selectedFiles = await window.ipcRenderer.invoke("select-audio-files");
		if (selectedFiles) {
			onFilesSelected(selectedFiles);
		}
	};

	const sidebarItems = [
		{ icon: "home", label: "Home", onClick: null },
		{ icon: "explore", label: "Explore", onClick: null },
		{ icon: "library_music", label: "Library", onClick: null },
		{ icon: "queue_music", label: "Queue", onClick: null },
		{ icon: "file_upload", label: "Upload files", onClick: handleSelectFiles },
	];

	const sidebarTransform = isOpen ? "translate-x-0" : "-translate-x-full";

	return (
		<>
			{/* Sidebar */}
			<div
				className={`glass-panel transition-transform duration-200 ease-in-out z-40 border-r border-[#2a2a2a]
					fixed top-16 bottom-0 w-70 lg:w-70 lg:shadow-none
					${sidebarTransform}`}
			>
				<div className="px-4 pt-6 pb-4 flex flex-col gap-2 h-full overflow-hidden">
					<div className="text-xs uppercase tracking-[0.08em] text-neutral-400 px-2">
						Quick Access
					</div>
					<ul className="list-none p-0 m-0 space-y-1 overflow-y-auto">
						{sidebarItems.map((item, index) => (
							<li
								key={index}
								className="group flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-[#232323] transition"
								onClick={() => item.onClick && item.onClick()}
							>
								<span className="material-icons-outlined text-[22px] text-neutral-200 group-hover:text-white">
									{item.icon}
								</span>
								<span className="text-sm text-neutral-200 group-hover:text-white">
									{item.label}
								</span>
							</li>
						))}
					</ul>
					<div className="mt-auto">
						<div className="text-xs uppercase tracking-[0.08em] text-neutral-400 px-2 mb-2">
							Your Library
						</div>
						<div className="flex flex-col gap-2">
							<div className="rounded-lg bg-[#1f1f1f] border border-border px-3 py-2 text-sm text-neutral-300">
								Add folders to build your library and keep them in sync.
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Overlay */}
			<div
				className={`fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.45)] z-20 ${
					isOpen ? "block" : "hidden"
				}`}
				onClick={toggleSidebar}
			></div>
		</>
	);
}
