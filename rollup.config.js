import mdx from 'rollup-plugin-mdx';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.jsx',
    output: {
        file: 'tmp/bundle.js',
        format: 'cjs',
    },
    plugins: [
        mdx({
            babelOptions: {/* custom options */}
        }),
        resolve(),
        commonjs(),
        babel({
            babelHelpers: 'bundled',
            exclude: 'node_modules/**',
            extensions: ['.mjs', '.js', '.jsx', '.md'],
        }),
    ]
};