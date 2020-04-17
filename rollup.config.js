import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

const config = {
    input: 'src/index.js',
    external: ['react'],
    plugins: [
        babel({
            exclude: 'node_modules/**',
        }),
        uglify(),
    ],
    output: {
        format: 'umd',
        name: 'index',
        globals: {
            react: 'React',
        },
    },
};
export default config;