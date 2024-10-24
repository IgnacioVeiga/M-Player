import React from 'react';

const FileSelector = ({ onFilesSelected }) => {
    const handleSelectFiles = async () => {
        const selectedFiles = await window.electronAPI.selectAudioFiles();
        if (selectedFiles) {
            onFilesSelected(selectedFiles); // Pass the selected files to the parent component
        }
    };

    return (
        <div>
            <button onClick={handleSelectFiles}>Select Audio Files</button>
        </div>
    );
};

export default FileSelector;
