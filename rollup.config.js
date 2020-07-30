import mdx from 'rollup-plugin-mdx';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import externals from 'rollup-plugin-node-externals'

export default require('./languages').map(({extension}) => {
    const extensions = ['.mjs', '.js', '.jsx', '.md', '.mdx'].flatMap(ext => ([`.${extension}${ext}`, ext]));

    return {
        input: {
            main: 'src/index.jsx'
        },
        output: {
            dir: 'tmp',
            format: 'cjs',
            entryFileNames: `[name].${extension}.js`,
            chunkFileNames: `[name].${extension}.js`,
            manualChunks(id) {
                if (id.includes('node_modules')) {
                    return `vendor`;
                }
            }
        },
        external: externals(),
        plugins: [
            mdx({
                babelOptions: {/* custom options */}
            }),
            resolve({
                extensions,
            }),
            commonjs(),
            babel({
                babelHelpers: 'bundled',
                exclude: 'node_modules/**',
                extensions,
            }),
        ]
    };
});