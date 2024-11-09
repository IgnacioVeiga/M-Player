import React from 'react';

const MetadataDisplay = ({ title, artist, album, image }) => (
    <div className="file-metadata">
        <div className="album-art">
            {image ? <img src={image} alt="Album Art" /> : <div className="no-image">No Image</div>}
        </div>
        <h3>{title || 'No title'}</h3>
        <p>{artist ? `${artist} - ${album}` : 'No artist - No album'}</p>
    </div>
);

export default MetadataDisplay;
