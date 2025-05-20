export default function Lyrics({ file }) {
    return (
        <p className='px-5 py-0 text-center whitespace-break-spaces'>
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