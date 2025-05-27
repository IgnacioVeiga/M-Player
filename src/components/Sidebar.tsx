import { SidebarProps } from "@/types";

export default function Sidebar({ isOpen, toggleSidebar, onFilesSelected }: SidebarProps) {
	const handleSelectFiles = async () => {
		const selectedFiles = await window.ipcRenderer.invoke("select-audio-files");
		if (selectedFiles) {
			onFilesSelected(selectedFiles);
		}
	};

	const sidebarItems = [
		{ icon: "home", label: "Principal", onClick: null },
		{ icon: "explore", label: "Explore", onClick: null },
		{ icon: "library_music", label: "Library", onClick: null },
		{ icon: "add", label: "Add", onClick: handleSelectFiles },
	];

	return (
		<>
			{/* Sidebar */}
			<div
				className={`fixed top-0 h-full w-[250px] bg-[#202020] transform transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<ul className="list-none p-[72px_0] m-0">
					{sidebarItems.map((item, index) => (
						<li
							key={index}
							className={`flex items-center p-4 text-[#bbb] border-b border-[#333] cursor-pointer hover:bg-[#333] transition`}
							onClick={() => {
								if (item.onClick) item.onClick();
							}}
						>
							<span
								className={`material-icons-outlined mr-2 text-[20px] text-[#ccc]`}
							>
								{item.icon}
							</span>
							{item.label}
						</li>
					))}
				</ul>
			</div>

			{/* Overlay */}
			<div
				className={`fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-9 ${
					isOpen ? "block" : "hidden"
				}`}
				onClick={toggleSidebar}
			></div>
		</>
	);
}
