const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const { parseBuffer } = require('music-metadata');
const uint8ArrayToBase64 = require('./utils.js');

function registerFileHandlers() {
    ipcMain.handle('select-audio-files', async () => {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
        });

        if (canceled) return null;

        const filesWithMetadata = await Promise.all(filePaths.map(async (filePath) => {
            const fileBuffer = fs.readFileSync(filePath);
            const metadata = await parseBuffer(fileBuffer);

            let imageBase64 = null;

            if (metadata.common.picture?.length) {
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

    ipcMain.handle('load-audio-file', async (_, filePath) => {
        try {
            const audioData = fs.readFileSync(filePath);
            return `data:audio/mpeg;base64,${audioData.toString('base64')}`;
        } catch (error) {
            console.error('Error loading audio file:', error);
            throw error;
        }
    });
}

module.exports = { registerFileHandlers };
