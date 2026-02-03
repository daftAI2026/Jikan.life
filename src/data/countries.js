/**
 * [INPUT]: 依赖 shared/countries.js
 * [OUTPUT]: 对外提供 countries 列表, getTimezone 函数
 * [POS]: data/ 共享数据代理，复用 shared/countries.js
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
export { countries, getTimezone } from '../../shared/countries.js';
