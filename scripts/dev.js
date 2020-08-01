require("core-js/es");

const express = require("express");
const { watchMemory } = require("./dev/watch");
const { STATIC_ROOT } = require("./common/constants");

(async () => {
  console.log("Starting compiler...");
  const watcher = await watchMemory();
  const app = express();
  const connections = new Set();

  app.use("/", (req, res, next) => {
    const filename = decodeURIComponent(req.path.replace(/^\//, ""));
    if (!watcher.assets[filename]) {
      next();
      return;
    }
    res.set({ "Content-Type": "text/html" }).send(watcher.assets[filename]);
  });

  app.use(express.static(STATIC_ROOT));

  app.use("/dev-updates", (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    });
    res.write("event: pong\n\n");

    const connection = { res, filename: req.query.filename };
    connections.add(connection);

    console.log(`Connected to: ${req.query.filename}`);

    req.on("close", () => {
      connections.delete(connection);
    });
  });

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
  app.listen(3000);
  console.log("Dev server listening on port 3000");
})();
