const babel = require("rollup-plugin-babel");
const filesize = require("rollup-plugin-filesize");
const pkg = require("./package.json");

const { keys } = Object;

const globals = {
  'funcadelic': 'Funcadelic',
  'react': 'React',
  'prop-types': 'PropTypes',
  'rxjs': 'RxJS',
  'microstates': 'Microstates'
};

module.exports = {
  input: "src/index.js",
  external: keys(globals),
  output: [
    {
      file: pkg.browser,
      format: "umd",
      name: "MicrostatesReact",
      globals,
      exports: "named",
      sourcemap: true
    },
    { file: pkg.module, format: "es", sourcemap: true }
  ],
  plugins: [
    babel({
      babelrc: false,
      comments: false,
      plugins: ["@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-object-rest-spread"],
      presets: [
        [
          "@babel/preset-env",
          {
            modules: false
          }
        ],
        "@babel/preset-react"
      ]
    }),
    filesize({
      render(opt, size, gzip, bundle) {
        return `Built: ${bundle.file} ( size: ${size}, gzip: ${gzip})`;
      }
    })
  ]
};