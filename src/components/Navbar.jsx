export default function Navbar({ onMenuClick }) {
	const userIcon = null;

	return (
		<header className="flex fixed top-0 left-0 right-0 items-center justify-between p-3 bg-[#121212] shadow-sm border-b border-[#333] z-20">
			<div
				className="flex items-center gap-3 cursor-pointer select-none text-white text-2xl font-semibold"
				onClick={onMenuClick}
			>
				<span className="material-icons-outlined active:scale-95 transition">
					menu
				</span>
				<h1>M-Player</h1>
			</div>

			<input
				type="text"
				className="w-[45%] px-4 py-2 rounded-full bg-[#242424] text-[#ddd] text-sm border-none placeholder-[#888] hover:bg-[#2c2c2c] transition"
				placeholder="Search music..."
			/>

			<div className="w-8 h-8 rounded-full overflow-hidden ml-3 cursor-pointer hover:bg-[#333] transition flex items-center justify-center">
				{userIcon ? (
					<img
						src="user-icon.png"
						alt="User"
						className="w-8 h-8 rounded-full"
					/>
				) : (
					<span className="material-icons-outlined text-white text-[32px]">
						account_circle
					</span>
				)}
			</div>
		</header>
	);
}
