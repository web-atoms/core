const path = require("path");

module.exports = {
    entry: "./bin/sample/app.js",
    mode: "development",
    watch: true,
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    }
};