import mdx from 'rollup-plugin-mdx';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';

export default require('./languages').map(language => {
    const extensions = ['.mjs', '.js', '.jsx', '.md', '.mdx'].flatMap(ext => ([`.${language}${ext}`, ext]));

    return {
        input: 'src/index.jsx',
        output: {
            file: `tmp/bundle.${language}.js`,
            format: 'cjs',
        },
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