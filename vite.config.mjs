import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron'

export default defineConfig({
    root: './',
    base: './',
    plugins: [
        react(),
        tailwindcss(),
        electron({
            main: {
                entry: 'electron/main.js',
                vite: {
                    build: {
                        outDir: path.resolve(__dirname, 'build/electron')
                    }
                }
            },
            preload: {
                input: 'electron/preload.js',
                vite: {
                    build: {
                        outDir: path.resolve(__dirname, 'build/electron')
                    }
                }
            }
        })
    ],
    build: {
        outDir: path.resolve(__dirname, 'build/app'),
        emptyOutDir: true
    },
    server: {
        port: 5173,
        strictPort: true
    }
})
