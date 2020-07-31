module.exports = {
  languages: {
    nl: {
      dateFormatting: "nl",
      documentTitle: "Het Verslag",
      htmlOutputFile: "{{documentTitle}}.nederlands.html",
      printOutputFile:
        "{{documentTitle}} - Nederlands (revisie {{revision}}).pdf",
      htmlPageTitle: "{{documentTitle}}",
    },
    en: {
      dateFormatting: "en-US",
      documentTitle: "The Report",
      htmlOutputFile: "{{documentTitle}}.english.html",
      printOutputFile: "{{documentTitle}} - English (revisie {{revision}}).pdf",
      htmlPageTitle: "{{documentTitle}}",
    },
  },
  publicUrl: "https://flut1.github.io/open-doc-demo/",
};
