const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 860,
        height: 640,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            webSecurity: false,
            devTools: true
        },
    });

    mainWindow.loadURL(
        process.env.ELECTRON_START_URL ||
        `file://${path.join(__dirname, '../build/index.html')}`
    );
}

app.on('ready', createWindow);

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
        return {
            title: metadata.common.title || 'Unknown Title',
            artist: metadata.common.artist || 'Unknown Artist',
            album: metadata.common.album || 'Unknown Album',
            duration: metadata.format.duration,
            path: filePath,
        };
    }));

    return filesWithMetadata;
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