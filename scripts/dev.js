require("core-js/es");

const express = require("express");
const cors = require("cors");
const { MemoryWatcher } = require("./dev/watch");
const { STATIC_ROOT } = require("./common/constants");

(async () => {
  console.log("Starting compiler...");
  const watcher = new MemoryWatcher();
  watcher.initialize();
  const app = express();
  const connections = new Set();

  app.use("/", (req, res, next) => {
    const logBusy = setTimeout(
      () => console.log(`Request "${req.path}" waiting for bundler...`),
      500
    );
    watcher.busy.then(() => clearTimeout(logBusy));

    watcher.busy.then(() => {
      const filename = decodeURIComponent(req.path.replace(/^\//, ""));
      if (!watcher.assets[filename]) {
        next();
        return;
      }
      res.set({ "Content-Type": "text/html" }).send(watcher.assets[filename]);
    });
  });

  app.use(express.static(STATIC_ROOT));

  app.use("/dev-updates", cors(), (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    });
    res.write("event: pong\n");
    res.write(`data: ${JSON.stringify({ ping: "pong" })}\n\n`);

    const connection = { res, filename: req.query.filename };
    connections.add(connection);

    console.log(`Connected to: ${req.query.filename}`);

    req.on("close", () => {
      connections.delete(connection);
    });
  });

  if (!process.env.CODESANDBOX_SSE) {
    await require("open")("http://localhost:3000/Het Verslag.nederlands.html");
  }

  watcher.on("change", (changes) => {
    console.log(
      `Asset changes: ${changes
        .map(
          (change) =>
            `${change.filename} (${
              change.type === "full" ? "full" : "content"
            })`
        )
        .join(", ")}`
    );

    Array.from(connections).forEach(({ res, filename }) => {
      const change = changes.find((change) => change.filename === filename);
      if (change) {
        if (change.type === "full") {
          res.write(`event: reload\n`);
          res.write(
            `data: ${JSON.stringify(
              changes
                .filter((change) => change.type === "full")
                .map((change) => change.filename)
            )}\n\n`
          );
        } else {
          res.write(`event: content\n`);
          res.write(`data: ${JSON.stringify({ content: change.content })}\n\n`);
        }
      }
    });
  });

  console.log("Starting dev server...");
  app.listen(8080);
  console.log("Dev server listening on port 8080");
})();
