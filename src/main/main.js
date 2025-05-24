const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { registerFileHandlers } = require('./fileHandlers');

const template = [
    {
        label: 'Archivo',
        submenu: [
            {
                label: 'Añadir archivo', click: () => {
                    // Acción para añadir un archivo
                }
            },
            { label: 'Salir', role: 'quit' }
        ]
    },
    {
        label: 'Herramientas',
        submenu: [
            {
                label: 'Consola', role: 'toggledevtools'
            },
            {
                label: 'Recargar', role: 'reload'
            },
            {
                label: 'Forzar recarga', role: 'forcereload'
            }
        ]
    }
];
const menu = Menu.buildFromTemplate(template);

// Establecer el menú en la aplicación
Menu.setApplicationMenu(menu);

async function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 860,
        height: 640,
        icon: path.join(__dirname, '../renderer/assets', 'icon.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
        mainWindow.webContents.openDevTools()
    } else {
        const indexPath = path.join(__dirname, '../renderer/index.html')
        await mainWindow.loadFile(indexPath)
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
