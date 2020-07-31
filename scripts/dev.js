require("core-js/es");

const path = require("path");
const express = require("express");
const watch = require("./watch");

const OUTPUT_ROOT = path.join(__dirname, "../output");
const STATIC_ROOT = path.join(__dirname, "../static");

(async () => {
  await watch();

  console.log("Starting dev server...");
  const app = express();
  app.use("/", express.static(OUTPUT_ROOT));
  app.use("/", express.static(STATIC_ROOT));

  app.listen(3000);
  console.log("Dev server listening on port 3000");
})();
