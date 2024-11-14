const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 860,
        height: 640,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true
        },
    });

    mainWindow.loadURL(
        'http://localhost:3000' ||
        `file://${path.join(__dirname, '../build/index.html')}`
    );
}

app.on('ready', createWindow);

function uint8ArrayToBase64(uint8Array) {
    const binary = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
    return Buffer.from(binary, 'binary').toString('base64');
}

// Event to handle file selection
ipcMain.handle('select-audio-files', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
    });

    if (canceled) return null;

    const mm = await import('music-metadata');
    const filesWithMetadata = await Promise.all(filePaths.map(async (filePath) => {
        const metadata = await mm.parseFile(filePath);
        let imageBase64 = null;

        if (metadata.common.picture && metadata.common.picture.length > 0) {
            const picture = metadata.common.picture[0];
            const base64Image = uint8ArrayToBase64(picture.data);
            imageBase64 = `data:${picture.format};base64,${base64Image}`;
        }

        return {
            title: metadata.common.title || 'Unknown Title',
            artist: metadata.common.artist || 'Unknown Artist',
            album: metadata.common.album || 'Unknown Album',
            duration: metadata.format.duration,
            lyrics: metadata.common.lyrics,
            path: filePath,
            image: imageBase64,
        };
    }));

    return filesWithMetadata;
});

// Handle loading audio files securely
ipcMain.handle('load-audio-file', async (event, filePath) => {
    try {
        const audioData = fs.readFileSync(filePath);
        return `data:audio/mpeg;base64,${audioData.toString('base64')}`;
    } catch (error) {
        console.error('Error loading audio file:', error);
        throw error;
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});