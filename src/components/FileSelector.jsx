import React from 'react';

const FileSelector = ({ onFilesSelected }) => {
    const handleSelectFiles = async () => {
        const selectedFiles = await window.Electron.selectAudioFiles();
        if (selectedFiles) {
            onFilesSelected(selectedFiles); // Pass the files with metadata
        }
    };

    return (
        <div>
            <button onClick={handleSelectFiles}>Select Audio Files</button>
        </div>
    );
};

export default FileSelector;
