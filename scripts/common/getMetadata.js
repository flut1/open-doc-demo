const util = require("util");
const getLastCommit = util.promisify(require("git-last-commit").getLastCommit);
const { format: formatDate } = require("date-fns");
const Mustache = require("mustache");
const { getConfig } = require("./getConfig");
const packageJson = require("../../package.json");

let metadata = null;
let documentConfig = null;

function generateLanguageMetadata(language, currentData) {
  const languageConfig = currentData.config.languages[language];

  const lastChange = formatDate(
    currentData.lastCommit
      ? new Date(parseInt(currentData.lastCommit.committedOn, 10) * 1000)
      : Date.now(),
    "PPPpp",
    languageConfig
      ? { locale: require(`date-fns/locale/${languageConfig.dateFormatting}`) }
      : {}
  );

  const allKeys = {
    ...currentData,
    ...languageConfig,
    lastChange,
    language,
  };

  const languageMetadata = { lastChange, language };
  Object.entries(languageConfig).forEach(([key, value]) => {
    languageMetadata[key] = Mustache.render(value, allKeys);
  });

  return languageMetadata;
}

async function generateMetadata(currentDocumentConfig) {
  let lastCommit = null;
  try {
    lastCommit = await getLastCommit();
  } catch (e) {
    // do nothing
  }

  let revision = "development";

  if (lastCommit) {
    const revisionDate = formatDate(
      new Date(parseInt(lastCommit.committedOn, 10) * 1000),
      "MMM-yyyy"
    );

    const revisionIteration = 1; // todo: detect current revision
    revision = `${revisionDate.toLowerCase()}.${revisionIteration}`;
  }

  const baseMetadata = {
    config: currentDocumentConfig,
    generatorUrl: `${packageJson.name} ${packageJson.repository}`,
    lastCommit,
    revision,
  };

  return {
    languages: Object.fromEntries(
      Object.keys(currentDocumentConfig.languages).map((languageKey) => [
        languageKey,
        generateLanguageMetadata(languageKey, baseMetadata),
      ])
    ),
    ...baseMetadata,
  };
}

function getMetadata() {
  const currentDocumentConfig = getConfig();
  if (metadata && documentConfig === currentDocumentConfig) {
    return metadata;
  }

  documentConfig = currentDocumentConfig;
  metadata = generateMetadata(currentDocumentConfig);
  return metadata;
}

module.exports = getMetadata;
