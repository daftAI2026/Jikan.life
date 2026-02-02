/**
 * [INPUT]: 依赖 vite, @vitejs/plugin-react, @tailwindcss/vite
 * [OUTPUT]: Vite 构建配置 (Proxy, Alias)
 * [POS]: 项目构建根配置
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': '/src',
        },
    },
    server: {
        proxy: {
            '/generate': 'http://127.0.0.1:8787',
            '/health': 'http://127.0.0.1:8787',
        }
    }
})
