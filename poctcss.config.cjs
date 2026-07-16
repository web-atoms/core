module.exports = (ctx) => ({
    map: { ... ctx.options.map, sourcesContent: false },
    plugins: [
        require("postcss-import-styled-js")(),
        require('postcss-preset-env')({
          stage: 4
        }),
        require("postcss-import-ext-glob")(),
        require("postcss-import")(),
        require("postcss-nested")(),
        require("postcss-copy-assets")({ base: ctx.options.base }),
        require("cssnano")()
    ]
  });
  