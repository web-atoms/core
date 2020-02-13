const fs = require("fs");
const Path = require("path");

fs.unlinkSync("package.json");
fs.renameSync("package-original.json", "package.json");

const deleteFolderRecursive = function(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path).forEach((file, index) => {
        const curPath = Path.join(path, file);
        if (fs.lstatSync(curPath).isDirectory()) {
            // recursive
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(path);
    }
  };

deleteFolderRecursive("./docs");
