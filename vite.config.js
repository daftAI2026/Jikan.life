/**
 * [INPUT]: 依赖 vite, @vitejs/plugin-react, @tailwindcss/vite
 * [OUTPUT]: Vite 构建配置 (Proxy, Alias)
 * [POS]: 项目构建根配置
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const MANUAL_CHUNK_GROUPS = {
    'react-core': ['react', 'react-dom', 'scheduler'],
    router: ['react-router', 'react-router-dom'],
    motion: ['framer-motion', 'motion-dom'],
    kumo: ['@cloudflare/kumo'],
    aria: ['react-aria-components'],
    date: ['date-fns', '@date-fns/tz', 'react-day-picker'],
    icons: ['@phosphor-icons/react'],
}

function isNodeModulePath(id) {
    return id.includes('/node_modules/')
}

function includesPackagePath(id, pkgName) {
    return id.includes(`/node_modules/${pkgName}/`)
}

function resolveManualChunk(id) {
    if (!isNodeModulePath(id)) return undefined

    for (const [chunkName, packages] of Object.entries(MANUAL_CHUNK_GROUPS)) {
        if (packages.some((pkgName) => includesPackagePath(id, pkgName))) {
            return chunkName
        }
    }

    if (
        includesPackagePath(id, '@react-aria/') ||
        includesPackagePath(id, '@react-stately/') ||
        includesPackagePath(id, '@internationalized/')
    ) {
        return 'aria'
    }

    return 'vendor-misc'
}

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
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    return resolveManualChunk(id)
                },
            },
        },
    },
    server: {
        proxy: {
            '/generate': 'http://127.0.0.1:8787',
            '/health': 'http://127.0.0.1:8787',
        }
    }
})
