const util = require("util");
const getLastCommit = util.promisify(require("git-last-commit").getLastCommit);
const { format: formatDate } = require("date-fns");
const documentConfig = require("../../document.config");

async function getMetadata(language = null) {
  if (language && !documentConfig.languages[language]) {
    throw new Error(`Language "${language}" not found in document.config.js`);
  }
  const languageConfig = language ? documentConfig.languages[language] : null;

  let lastCommit = null;
  try {
    lastCommit = await getLastCommit();
  } catch (e) {
    console.log("Not able to determine last commit");
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

  const generatedOn = formatDate(
    lastCommit
      ? new Date(parseInt(lastCommit.committedOn, 10) * 1000)
      : Date.now(),
    "PPPpp",
    languageConfig
      ? { locale: require(`date-fns/locale/${languageConfig.dateFormatting}`) }
      : {}
  );

  const metadata = {
    config: documentConfig,
    lastCommit,
    revision,
    generatedOn,
  };

  if (languageConfig) {
    return {
      metadata,
      ...languageConfig,
      language,
    };
  }

  return metadata;
}

module.exports = getMetadata;
