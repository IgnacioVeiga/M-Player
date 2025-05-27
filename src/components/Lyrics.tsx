import { LyricsProps } from "@/types";
import { JSX } from "react/jsx-runtime";

export default function Lyrics({ file }: LyricsProps): JSX.Element {
	if (!file || !file.lyrics || file.lyrics.length === 0) {
		return <p className="px-5 py-0 text-center whitespace-break-spaces">No lyrics available</p>;
	} else {
		return (
			<p className="px-5 py-0 text-center whitespace-break-spaces">
				{file?.lyrics?.map((line, idx) => (
					<p key={idx}>{line.text}</p>
				))}
			</p>
		);
	}
}
