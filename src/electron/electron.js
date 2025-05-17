const { app, BrowserWindow } = require('electron');
const path = require('path');
const { registerFileHandlers } = require('./fileHandlers');

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

    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, '../../build/index.html')}`;
    mainWindow.loadURL(startUrl);
}

app.whenReady().then(() => {
    createWindow();
    registerFileHandlers();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
