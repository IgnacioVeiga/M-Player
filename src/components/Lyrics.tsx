import { LyricsProps } from "@/types";
import { JSX } from "react/jsx-runtime";

export default function Lyrics({ file }: LyricsProps): JSX.Element {
	if (!file || !file.lyrics || file.lyrics.length === 0) {
		return (
			<div className="px-5 py-3 text-center text-neutral-400 whitespace-break-spaces">
				No lyrics available
			</div>
		);
	}

	return (
		<div className="px-5 py-3 text-center whitespace-break-spaces">
			{file.lyrics.map((line, idx) => (
				<p key={idx}>{line.text}</p>
			))}
		</div>
	);
}
