module.exports = {
  languages: {
    nl: {
      dateFormatting: "nl",
      languageTag: "nl", // see BCP47 https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
      documentTitle: "Het Verslag",
      webOutputFile: "{{documentTitle}}.nederlands.html",
      webPageTitle: "{{documentTitle}}",
      printOutputFile:
        "{{documentTitle}} - Nederlands (revisie {{revision}}).pdf",
    },
    en: {
      dateFormatting: "en-US",
      languageTag: "en", // see BCP47 https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/lang
      documentTitle: "The Report",
      webOutputFile: "{{documentTitle}}.english.html",
      webPageTitle: "{{documentTitle}}",
      printOutputFile: "{{documentTitle}} - English (revisie {{revision}}).pdf",
    },
  },
  publicUrl: "https://flut1.github.io/open-doc-demo/",
};
