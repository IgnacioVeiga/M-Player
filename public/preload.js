const { contextBridge, ipcRenderer } = require('electron');

// Expose APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    selectAudioFiles: () => ipcRenderer.invoke('select-audio-files'),
});
