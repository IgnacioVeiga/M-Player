import { NavbarProps } from "@/types";
import { JSX } from "react/jsx-runtime";

export default function Navbar({
	onMenuClick,
	searchQuery,
	onSearchChange,
}: NavbarProps): JSX.Element {
	return (
		<header className="fixed top-0 left-0 right-0 z-30 glass-panel">
			<div className="flex items-center gap-4 px-4 py-3">
				<button
					onClick={onMenuClick}
					className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#2b2b2b] transition active:scale-95 text-white"
					title="Open navigation"
				>
					<span className="material-icons-outlined text-2xl">menu</span>
				</button>

				<div className="flex items-center gap-1 text-white font-semibold text-xl tracking-tight select-none">
					<span className="material-icons text-primary text-[24px]">play_circle</span>
					<span className="hidden sm:inline">Music</span>
					<span className="sm:hidden">M</span>
				</div>

				<div className="flex-1 flex justify-center">
					<div className="flex items-center w-full max-w-2xl bg-[#1e1e1e] border border-[#2f2f2f] rounded-full px-4 py-2 focus-within:border-primary focus-within:shadow-[0_0_0_1px_var(--color-primary)] transition">
						<span className="material-icons text-[#888] mr-2 text-lg">search</span>
						<input
							type="text"
							value={searchQuery}
							onChange={(event) => onSearchChange(event.target.value)}
							className="flex-1 bg-transparent text-sm text-white placeholder-[#777] outline-none"
							placeholder="Search songs, artists, or albums"
						/>
						<span className="material-icons-outlined text-[#888] ml-2 text-lg hidden sm:inline">
							mic
						</span>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#2b2b2b] transition text-white">
						<span className="material-icons-outlined text-xl">cast</span>
					</button>
					<button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#2b2b2b] transition text-white">
						<span className="material-icons-outlined text-xl">settings</span>
					</button>
					<button className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#ff4d6d] to-[#ff0033] text-white font-semibold">
						N
					</button>
				</div>
			</div>
		</header>
	);
}
