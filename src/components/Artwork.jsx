import React from 'react'
import './Artwork.css'

export default function Artwork({ file }) {
    return (
        <div className="artwork">
            { file?.image
                ?
                <img src={file.image} alt="Album Art" />
                :
                <div className="no-image">No Image</div>
            }
            <h3>{file?.title || 'No title'}</h3>
            <p>{file?.artist ? `${file.artist} - ${file.album}` : 'No artist - No album'}</p>
        </div>
    );
}
