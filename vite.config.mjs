import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import electron from 'vite-plugin-electron'

export default defineConfig({
    root: './src/renderer',
    base: './',
    plugins: [
        react(),
        tailwindcss(),
        electron({
            main: {
                entry: 'src/main/main.js'
            },
            preload: {
                input: 'src/main/preload.js'
            }
        })
    ],
    build: {
        outDir: path.resolve(__dirname, 'dist/renderer'),
        emptyOutDir: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/renderer')
        }
    },
    server: {
        port: 5173,
        strictPort: true
    }
})
