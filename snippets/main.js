var beefy = require("beefy");
var http = require("http");
var chrome_runner = require("node-chrome-runner");

console.log("Starting Beefy server at port 5000");
http.createServer(beefy({
    entries: ["index.js"],
    cwd: __dirname,
    live: false,
    quiet: false
})).listen(5000);

console.log("Launching Chrome");
var c = chrome_runner.runChrome({
  args:["--no-first-run", "--no-default-browser-check",
        "--disable-translate", "--disable-default-apps",
        "--disable-web-security", "--user-data-dir=tmp", "http://localhost:5000/"
  ],
  processOptions:{stdio: "inherit"}
});
