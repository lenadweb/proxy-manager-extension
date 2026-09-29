import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

const promoRoot = import.meta.dirname;
const projectRoot = resolve(promoRoot, '../..');

export default defineConfig({
    root: promoRoot,
    publicDir: resolve(projectRoot, 'public'),
    resolve: {
        alias: {
            src: resolve(projectRoot, 'src'),
        },
    },
    plugins: [react(), tailwindcss(), svgr()],
    server: {
        port: 5199,
        strictPort: true,
        fs: { allow: [projectRoot] },
    },
});
