const { contextBridge, ipcRenderer } = require('electron');

// Expose APIs to the renderer process
contextBridge.exposeInMainWorld('Electron', {
    selectAudioFiles: () => ipcRenderer.invoke('select-audio-files'),
    loadAudioFile: (filePath) => ipcRenderer.invoke('load-audio-file', filePath)
});
