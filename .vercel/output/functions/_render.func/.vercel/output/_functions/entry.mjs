import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_Brysy8W1.mjs';
import { manifest } from './manifest_Cca7Lp-b.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/views/_slug_.astro.mjs');
const _page2 = () => import('./pages/post/_slug_.astro.mjs');
const _page3 = () => import('./pages/posts.astro.mjs');
const _page4 = () => import('./pages/projects.astro.mjs');
const _page5 = () => import('./pages/topics/_topic_.astro.mjs');
const _page6 = () => import('./pages/topics.astro.mjs');
const _page7 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/views/[slug].ts", _page1],
    ["src/pages/post/[slug].astro", _page2],
    ["src/pages/posts.astro", _page3],
    ["src/pages/projects.astro", _page4],
    ["src/pages/topics/[topic].astro", _page5],
    ["src/pages/topics.astro", _page6],
    ["src/pages/index.astro", _page7]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "6a3f91ae-903d-4dfb-b4a4-3e7c672788f5",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
