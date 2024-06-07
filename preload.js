const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    getAudioFiles: (directoryPath) => ipcRenderer.invoke('get-audio-files', directoryPath),
    createFileList: (files, onSelect) => {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';

        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.setAttribute('data-path', file.path);
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
    },
    updateCoverImage: (file) => {
        const coverImage = document.getElementById('cover');
        if (file.tags.image) {
            const imageBuffer = file.tags.image.imageBuffer;
            const base64Image = Buffer.from(imageBuffer).toString('base64');
            const mimeType = file.tags.image.mime;
            coverImage.src = `data:${mimeType};base64,${base64Image}`;
        } else {
            coverImage.src = 'assets/default-cover.jpg';
        }
    }
});
