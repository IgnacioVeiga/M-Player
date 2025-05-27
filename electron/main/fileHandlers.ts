import { AudioFile } from '@/types';
import { ipcMain, dialog, OpenDialogReturnValue } from 'electron';
import fs from 'fs';
import mime from 'mime-types';
import { IAudioMetadata, parseBuffer } from 'music-metadata';

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    const binary: string = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
    return Buffer.from(binary, 'binary').toString('base64');
}

export function registerFileHandlers() {
    ipcMain.handle('select-audio-files', async (): Promise<AudioFile[] | null> => {
        const { canceled, filePaths }: OpenDialogReturnValue = await dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{ name: 'Audio Files', extensions: ['mp3', 'wav', 'ogg'] }],
        });

        if (canceled) return null;

        return await Promise.all(
            filePaths.map(async (filePath: string): Promise<AudioFile> => {
                const metadata: IAudioMetadata = await parseBuffer(
                    fs.readFileSync(filePath),
                    filePath
                );

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
                    duration: metadata.format.duration || 0,
                    lyrics: metadata.common.lyrics || [],
                    path: filePath,
                    image: imageBase64 || null,
                };
            })
        );
    });

    ipcMain.handle('load-audio-file', async (_, filePath): Promise<string> => {
        try {
            const audioData = fs.readFileSync(filePath);
            const mimeType = mime.lookup(filePath) || 'audio/mpeg';
            return `data:${mimeType};base64,${audioData.toString('base64')}`;
        } catch (error) {
            console.error('Error loading audio file:', error);
            throw error;
        }
    });
}
