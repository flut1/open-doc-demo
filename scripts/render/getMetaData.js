const util = require("util");
const getLastCommit = util.promisify(require("git-last-commit").getLastCommit);

function getMetaData() {}

module.exports = getMetaData;
