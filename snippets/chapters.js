var NONE = [{name: "- no snippets -" }];
var SELECT_CHAPTER = [{name: "- select a chapter first -"}];

module.exports = [
  {name: "- select a chapter -",          examples: SELECT_CHAPTER},
  {name: "1: Task Automation",            examples: require("./01")},
  {name: "2: ES2015 and Browserify",      examples: require("./02")},
  {name: "3: Sassy CSS",                  examples: require("./03")},
  {name: "4: More Responsive Design",     examples: require("./04")},
  {name: "5: Accessibility",              examples: require("./05")},
  {name: "6: Testing and UI Automation *",  examples: NONE},
  {name: "7: IndexedDB",                  examples: require("./07")},
  {name: "8: SQLite",                     examples: require("./08")},
  {name: "9: File Transfer",              examples: require("./09")},
  {name: "10: Performance *",               examples: NONE},
  {name: "11: Graphical Assets *",          examples: NONE},
  {name: "12: Deployment *",                examples: NONE}
];
