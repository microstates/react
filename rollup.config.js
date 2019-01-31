const babel = require('rollup-plugin-babel');
const pkg = require('./package.json');

const { keys } = Object;

const globals = {
  microstates: 'Microstates',
  react: 'React'
};

module.exports = {
  input: 'use-type.js',
  external: keys(globals),
  output: [
    {
      file: pkg.browser,
      format: 'umd',
      name: 'useType',
      globals,
      exports: 'named',
      sourcemap: true
    },
    { file: pkg.module, format: 'es', sourcemap: true }
  ],
  plugins: [
    babel({
      babelrc: false,
      comments: false,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false
          }
        ]
      ]
    })
  ]
};
