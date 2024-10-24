const fs = require('fs');
const path = require('path');
const NodeID3 = require('node-id3');

function getAllAudioFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            getAllAudioFiles(filePath, fileList);
        } else if (file.endsWith('.mp3') || file.endsWith('.wav')) {
            fileList.push(filePath);
        }
    });
    return fileList;
}

function getAudioFilesWithMetadata(directoryPath) {
    const audioFiles = getAllAudioFiles(directoryPath);
    return audioFiles.map(filePath => {
        const tags = NodeID3.read(filePath);
        return { file: path.basename(filePath), path: filePath, tags };
    });
}

module.exports = { getAudioFilesWithMetadata };
