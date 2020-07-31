import "core-js/features/array";
import "core-js/features/object";
import Mustache from "mustache";
import babel from "@rollup/plugin-babel";
import mdx from "rollup-plugin-mdx";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import externals from "rollup-plugin-node-externals";
import nodeEval from "node-eval";

const languages = require("../../document.config").languages;
const getMetadata = require("../render/getMetadata");
const { renderHtml } = require("../render/renderHtml");

export default Promise.all(
  Object.entries(languages).map(async ([key, languageConfig]) => {
    const extensions = [".mjs", ".js", ".jsx", ".md", ".mdx"].flatMap((ext) => [
      `.${key}${ext}`,
      ext,
    ]);
    const metadata = await getMetadata(key);
    const babelOptions = require("./babel.config");

    const outputFilename = Mustache.render(
      languageConfig.htmlOutputFile,
      metadata
    );

    return {
      input: {
        main: "document/index.jsx",
      },
      output: {
        dir: "output",
        format: "cjs",
        entryFileNames: outputFilename,
        plugins: [
          {
            name: "execBundle",
            renderChunk(code) {
              const { render } = nodeEval(code, "bundle://main.js");
              return render();
            },
          },
          {
            name: "wrapHtml",
            renderChunk(code) {
              return renderHtml("document.html", key, code);
            },
          },
        ],
      },
      inlineDynamicImports: true,
      external: externals(),
      plugins: [
        mdx({
          babelOptions,
        }),
        resolve({
          extensions,
        }),
        commonjs(),
        babel({
          ...babelOptions,
          babelHelpers: "bundled",
          exclude: "node_modules/**",
          extensions: [".js", ".jsx"],
        }),
      ],
    };
  })
);
