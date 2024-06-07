function createFileList(audioFiles, onSelect) {
    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';

    audioFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
        <span class="title">${file.tags.title || file.file}</span>
        <span class="artist-album">${file.tags.artist || ''} - ${file.tags.album || ''}</span>
        <span class="duration">${file.tags.duration || ''}</span>
      `;
        fileItem.addEventListener('click', () => {
            onSelect(file);
        });
        fileList.appendChild(fileItem);
    });
}

module.exports = { createFileList };
