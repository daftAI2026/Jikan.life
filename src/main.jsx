/**
 * [INPUT]: 依赖 react, react-dom/client, ./App.jsx, ./index.css
 * [OUTPUT]: 无 (Web App 入口渲染)
 * [POS]: 前端应用入口，挂载 React 树到 DOM
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
