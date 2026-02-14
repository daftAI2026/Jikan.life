/**
 * [INPUT]: 依赖 vite, @vitejs/plugin-react, @tailwindcss/vite, node:path
 * [OUTPUT]: Vite 构建配置 (Proxy, Alias)
 * [POS]: 项目构建根配置
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import path from 'node:path'
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
            'match-sorter': '/src/lib/match-sorter-shim.js',
            // base-ui exports 字段封锁了内部模块，Kumo Select portal 重定向需要直接访问
            '#base-ui-portal': path.resolve('node_modules/@base-ui/react/esm/floating-ui-react/components/FloatingPortal.js'),
        },
    },
    server: {
        proxy: {
            '/generate': 'http://127.0.0.1:8787',
            '/health': 'http://127.0.0.1:8787',
        }
    }
})
