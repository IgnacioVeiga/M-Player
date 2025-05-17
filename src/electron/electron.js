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

    // Si está en desarrollo, cargar localhost:3000
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools(); // opcional
    } else {
        // Si no, cargar el index.html empaquetado
        mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
    }
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
