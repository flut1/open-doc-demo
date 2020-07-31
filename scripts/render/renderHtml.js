const path = require("path");
const fs = require("fs-extra");
const Mustache = require("mustache");
const { html: beautifyHtml } = require("js-beautify");
const { TEMPLATE_ROOT } = require("../common/constants");
const getMetadata = require("./getMetadata");

const renderHtml = async (templateName, language = null, content) => {
  const template = await fs.readFile(
    path.join(TEMPLATE_ROOT, `${templateName}.mustache`),
    { encoding: "utf8" }
  );
  const metadata = await getMetadata(language);
  return beautifyHtml(Mustache.render(template, { ...metadata, content }));
};

const renderIndexHtml = async () =>
  beautifyHtml(await renderHtml("index.html"));

module.exports = {
  renderIndexHtml,
  renderHtml,
};
