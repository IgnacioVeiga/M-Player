interface LyricsProps {
    file?: {
        lyrics?: { text?: string }[];
    };
}

export default function Lyrics({ file }: LyricsProps) {
    return (
        <p className='px-5 py-0 text-center whitespace-break-spaces'>
            {
                (file && file.lyrics && file.lyrics.length > 0)
                    ?
                    file?.lyrics[0]?.text
                    :
                    ''
            }
        </p>
    );
}