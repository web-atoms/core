
var modules = {
    exports: {}
};

function require(name){
    return modules[name];
}

modules.require = require;

var pending = {};

function define(requires, factory, name){
    var hasAll = true;
    for(var i = 0; i < requires.length ; i++){
        var item = requires[i];
        if(!/^(require|exports)$/.test(item)){
            item = bridge.resolveName(name, item);
        }
        if(!modules[item]){
            hasAll = false;
            if(!pending[item]){
                var fx = function(){
                    define(requires, factory, item);
                };
                pending[item] = fx;
                bridge.executeScript(item, fx);
            }
        }
    }

    if(hasAll) {
        var mExports = {};
        factory(require,mExports);
        modules[name || "exports"] = mExports;
    }
}

define.amd = true;