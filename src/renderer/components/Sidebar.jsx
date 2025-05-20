export default function Sidebar({ isOpen, toggleSidebar, onFilesSelected }) {
	const handleSelectFiles = async () => {
		const selectedFiles = await window.Electron.selectAudioFiles();
		if (selectedFiles) {
			onFilesSelected(selectedFiles);
		}
	};

	return (
		<>
			<div
				className={`fixed top-0 h-full w-[250px] bg-[#202020] transform transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 ${
					isOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<ul className="list-none p-[72px_0] m-0">
					<li className="flex items-center p-4 text-[#bbb] border-b border-[#333] cursor-pointer hover:bg-[#333] transition">
						<span className="material-icons-outlined mr-2 text-[20px] text-[#ccc]">
							home
						</span>
						Principal
					</li>
					<li className="flex items-center p-4 text-[#bbb] border-b border-[#333] cursor-pointer hover:bg-[#333] transition">
						<span className="material-icons-outlined mr-2 text-[20px] text-[#ccc]">
							explore
						</span>
						Explore
					</li>
					<li className="flex items-center p-4 text-[#bbb] border-b border-[#333] cursor-pointer hover:bg-[#333] transition">
						<span className="material-icons-outlined mr-2 text-[20px] text-[#ccc]">
							library_music
						</span>
						Library
					</li>
					<li
						onClick={handleSelectFiles}
						className="flex items-center p-4 text-[#bbb] border-b border-[#333] cursor-pointer hover:bg-[#333] transition"
					>
						<span className="material-icons-outlined mr-2 text-[20px] text-[#ccc]">
							add
						</span>
						Add
					</li>
				</ul>
			</div>

			<div
				className={`fixed top-0 left-0 w-full h-full bg-[rgba(0,0,0,0.5)] z-9 ${
					isOpen ? "block" : "hidden"
				}`}
				onClick={toggleSidebar}
			></div>
		</>
	);
}
