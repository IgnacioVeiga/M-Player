import '../styles/Artwork.css';

export default function Artwork({ file, size = 'large' }) {
    return (
        <div className={`artwork ${size}`}>
            {file?.image ? (
                <img src={file.image} alt="Album Art" />
            ) : (
                <div className="no-image">No Image</div>
            )}
        </div>
    );
}
