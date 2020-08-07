import "core-js/features/array";
import "core-js/features/object";
import babel from "@rollup/plugin-babel";
import mdx from "rollup-plugin-mdx";
import resolve from "@rollup/plugin-node-resolve";

const { MDX_ROOT } = require("../common/constants");
const { getConfig } = require("../common/getConfig");
const getMetadata = require("../common/getMetadata");
const {
  staticallyRenderMdxBundle,
  renderHtmlTemplate,
} = require("../render/renderStaticHtml");

const renderChunkWithMetadata = (pluginFn, initialMetadata) => {
  let metadata = initialMetadata;

  return {
    renderChunk(code) {
      return pluginFn(code, metadata);
    },
    setMetadata(newData) {
      metadata = { ...metadata, ...newData };
    },
  };
};

export default async () => {
  const { languages } = getConfig();
  const baseMetadata = await getMetadata();

  return Object.keys(languages).map((languageKey) => {
    const extensions = [
      ".mjs",
      ".js",
      ".jsx",
      ".md",
      ".mdx",
    ].flatMap((ext) => [`.${languageKey}${ext}`, ext]);
    const metadata = {
      ...baseMetadata,
      ...baseMetadata.languages[languageKey],
    };
    const babelOptions = require("./babel.config");

    return {
      input: {
        main: "document/index.jsx",
      },
      output: {
        dir: "output",
        format: "cjs",
        exports: "default",
        name: "render",
        entryFileNames: metadata.webOutputFile,
        plugins: [
          {
            name: "staticallyRenderMdxBundle",
            ...renderChunkWithMetadata((code, m) => {
              return staticallyRenderMdxBundle(code, m);
            }, metadata),
            renderChunk(code) {
              return staticallyRenderMdxBundle(code, metadata);
            },
          },
          {
            name: "wrapHtml",
            ...renderChunkWithMetadata((code, m) => {
              return renderHtmlTemplate("document.html", {
                ...m,
                content: code,
              });
            }, metadata),
          },
        ],
      },
      inlineDynamicImports: true,
      plugins: [
        mdx({
          babelOptions,
        }),
        resolve({
          extensions,
          jail: MDX_ROOT,
        }),
        babel({
          ...babelOptions,
          babelHelpers: "bundled",
          exclude: "node_modules/**",
          extensions: [".js", ".jsx"],
        }),
      ],
    };
  });
};
