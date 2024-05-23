const esbuild = require("esbuild");
const {
  nodeModulesPolyfillPlugin,
} = require("esbuild-plugins-node-modules-polyfill");

const args = process.argv.slice(2);
const watch = args.includes("--watch");
const deploy = args.includes("--deploy");

const getDefines = () => {
  const nodeEnv = args
    .find((a) => a.startsWith("--node_env"))
    .split("=")
    .splice(1)[0];

  switch (nodeEnv) {
    case "dev":
      return {
        ESBUILD_WS_URL: '"ws://localhost:4000/socket"',
        ESBUILD_ENV: '"dev"',
      };
    case "prod":
      return {
        ESBUILD_WS_URL: '"wss://wasail-al-shia.net/socket"',
        ESBUILD_ENV: '"prod"',
      };
  }
};

const loader = {
  ".js": "jsx",
  ".woff": "file",
  ".woff2": "file",
  ".ttf": "file",
};

const plugins = [nodeModulesPolyfillPlugin()];

let opts = {
  entryPoints: ["js/index.js"],
  bundle: true,
  logLevel: "info",
  target: "es2017",
  outdir: "../priv/static/assets",
  external: ["fonts/*", "images/*"],
  nodePaths: ["../deps"],
  loader,
  plugins,
  define: getDefines(),
};

if (deploy) {
  opts = {
    ...opts,
    minify: true,
  };
}

if (watch) {
  opts = {
    ...opts,
    sourcemap: "inline",
  };
  esbuild
    .context(opts)
    .then((ctx) => {
      ctx.watch();
    })
    .catch((_error) => {
      process.exit(1);
    });
} else {
  esbuild.build(opts);
}
