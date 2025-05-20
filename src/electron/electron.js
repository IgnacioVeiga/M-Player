const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');
const { registerFileHandlers } = require('./fileHandlers');

function waitForViteDevServer(url, timeout = 10000) {
    const start = Date.now();
    return new Promise((resolve, reject) => {
        const check = () => {
            const req = http.get(url, res => {
                if (res.statusCode === 200) resolve();
                else retry();
            });

            req.on('error', retry);
            req.end();
        };

        const retry = () => {
            if (Date.now() - start > timeout) {
                reject(new Error('Vite dev server not responding'));
            } else {
                setTimeout(check, 300);
            }
        };

        check();
    });
}

async function createWindow() {
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
        const devServerUrl = 'http://localhost:5173';
        try {
            await waitForViteDevServer(devServerUrl);
            await mainWindow.loadURL(devServerUrl);
            mainWindow.webContents.openDevTools();
        } catch (err) {
            console.error(err);
        }
    } else {
        const indexPath = path.join(app.getAppPath(), 'dist/renderer/index.html');
        console.log('Cargando desde:', indexPath);
        await mainWindow.loadFile(indexPath);
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
