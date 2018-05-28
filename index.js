require("amd-loader");

var test = require("./bin/test");

test.test().catch(a => {
    console.error(a);
}).then(()=>{
    console.log("Tests ran successfully.")
});