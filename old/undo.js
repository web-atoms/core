const fs = require("fs");

fs.unlinkSync("package.json");
fs.renameSync("package-original.json", "package.json");

