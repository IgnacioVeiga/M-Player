import { AudioFile } from '@/types';
import { ipcMain, dialog, OpenDialogReturnValue, OpenDialogOptions } from 'electron';
import { IPicture, parseFile } from 'music-metadata';
import { lookup } from 'mime-types';
import { homedir } from 'os';
import { join } from 'path';
import { pathToFileURL } from 'node:url';
import { readFile } from 'node:fs/promises';

const isDevServer = Boolean(process.env.VITE_DEV_SERVER_URL);

function uint8ArrayToBase64(uint8Array: Uint8Array): string {
    const binary: string = Array.from(uint8Array, byte => String.fromCharCode(byte)).join('');
    return Buffer.from(binary, 'binary').toString('base64');
}

const isAudioFile = (file: AudioFile | null): file is AudioFile => file !== null;

async function loadAudioMetadata(filePath: string): Promise<AudioFile | null> {
    try {
        const metadata = await parseFile(filePath);

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
    } catch (error) {
        console.error(`Error reading metadata for "${filePath}":`, error);
        return null;
    }
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

        const metadata = await Promise.all(filePaths.map((filePath) => loadAudioMetadata(filePath)));
        return metadata.filter(isAudioFile);
    });

    ipcMain.handle('load-audio-metadata', async (_, filePaths: string[]): Promise<AudioFile[]> => {
        const metadata = await Promise.all(filePaths.map((filePath) => loadAudioMetadata(filePath)));
        return metadata.filter(isAudioFile);
    });

    ipcMain.handle('load-audio-file', async (_, filePath): Promise<string> => {
        try {
            if (isDevServer) {
                // In dev the renderer runs on http://, so Chrome blocks file://. Use data URI as fallback.
                const audioData = await readFile(filePath);
                const mimeType = lookup(filePath) || 'audio/mpeg';
                return `data:${mimeType};base64,${audioData.toString('base64')}`;
            }

            // In packaged app we can stream directly from disk.
            return pathToFileURL(filePath).toString();
        } catch (error) {
            console.error('Error loading audio file:', error);
            throw error;
        }
    });
}
