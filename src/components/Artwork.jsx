import '../styles/Artwork.css';

export default function Artwork({ file }) {
    return (
        <div className="artwork">
            { file?.image
                ? <img src={file.image} alt="Album Art" />
                : <div className="no-image">No Image</div>
            }
        </div>
    );
}
