import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    root: './src',
    base: './',
    plugins: [
        react(),
        tailwindcss()
    ],
    build: {
        outDir: path.resolve(__dirname, 'dist/renderer'),
        emptyOutDir: true,
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
