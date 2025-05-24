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
                entry: 'electron/main.js'
            },
            preload: {
                input: 'electron/preload.js'
            }
        })
    ],
    build: {
        outDir: 'build/app',
        emptyOutDir: true
    },
    server: {
        port: 5173,
        strictPort: true
    }
})
