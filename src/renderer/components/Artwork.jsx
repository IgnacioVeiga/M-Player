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
// export default function Artwork({ file, size }) {
//     const className = size === 'thumbnail' ? 'artwork-thumbnail' : 'artwork-full';

//     return (
//         <div className={className}>
//             {
//                 file
//                     ? <img src="./assets/placeholder.jpg" alt="Artwork" />
//                     : <div className="placeholder"></div>
//             }
//         </div>
//     );
// }
