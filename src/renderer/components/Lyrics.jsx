import '../styles/Lyrics.css';

export default function Lyrics({ file }) {
    return (
        <p className='lyrics'>
            {
                (file && file.lyrics?.length > 0)
                    ?
                    file?.lyrics[0]?.text
                    :
                    ''
            }
        </p>
    );
}