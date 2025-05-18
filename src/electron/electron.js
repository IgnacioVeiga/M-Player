const { app, BrowserWindow } = require('electron');
const path = require('path');
const { registerFileHandlers } = require('./fileHandlers');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 860,
        height: 640,
        // icon: path.join(__dirname, 'assets', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true
        },
    });

    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        const indexPath = path.join(app.getAppPath(), 'dist/renderer/index.html');
        console.log('Cargando desde:', indexPath);
        mainWindow.loadFile(indexPath);
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
