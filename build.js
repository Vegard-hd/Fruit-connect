await Bun.build({
  entrypoints: ["public/index.js", "public/index.css"],
  outdir: "./public/build",
  splitting: true,
  minify: {
    whitespace: true,
    identifiers: true,
    syntax: true,
  },
});
