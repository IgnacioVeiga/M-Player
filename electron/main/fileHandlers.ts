import { AudioFile } from '@/types';
import { ipcMain, dialog, OpenDialogReturnValue, OpenDialogOptions } from 'electron';
import { lookup } from 'mime-types';
import { IAudioMetadata, IPicture, parseBuffer } from 'music-metadata';
import { readFileSync } from 'fs'
import { homedir } from 'os';
import { join } from 'path';

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    const binary: string = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
    return Buffer.from(binary, 'binary').toString('base64');
}

export function registerFileHandlers() {
    ipcMain.handle('select-audio-files', async (): Promise<AudioFile[] | null> => {
        const dialogOptions: OpenDialogOptions = {
            properties: ['openFile', 'multiSelections'],
            defaultPath: join(homedir(), 'Music'),
            filters: [
                { name: 'Audio Files', extensions: ['mp3', 'flac', 'ogg', 'm4a'] },
            ],
        };

        // Show the open dialog to select audio files
        const { canceled, filePaths }: OpenDialogReturnValue = await dialog.showOpenDialog(dialogOptions);

        if (canceled) return null;

        return await Promise.all(
            filePaths.map(async (filePath: string): Promise<AudioFile> => {
                const metadata: IAudioMetadata = await parseBuffer(
                    readFileSync(filePath),
                    filePath
                );

                let imageBase64 = null;

                if (metadata.common.picture?.length) {
                    const picture: IPicture = metadata.common.picture[0];
                    const base64Image: string = uint8ArrayToBase64(picture.data);
                    imageBase64 = `data:${picture.format};base64,${base64Image}`;
                }

                return {
                    title: metadata.common.title || 'Unknown Title',
                    artist: metadata.common.artist || 'Unknown Artist',
                    album: metadata.common.album || 'Unknown Album',
                    duration: metadata.format.duration || 0,
                    lyrics: metadata.common.lyrics || [],
                    path: filePath,
                    image: imageBase64 || null
                };
            })
        );
    });

    ipcMain.handle('load-audio-file', async (_, filePath): Promise<string> => {
        try {
            const audioData: Buffer = readFileSync(filePath);
            const mimeType: string = lookup(filePath) || 'audio/mpeg';
            return `data:${mimeType};base64,${audioData.toString('base64')}`;
        } catch (error) {
            console.error('Error loading audio file:', error);
            throw error;
        }
    });
}
