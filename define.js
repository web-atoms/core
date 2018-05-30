
var modules = {
    require: require,
    exports: {}
};

function require(name){
    return modules[name];
}

var pending = {};

var baseUrl = "";

function define(requires, factory, name){
    var hasAll = true;
    for(var i = 0; i < requires.length ; i++){
        var item = requires[i];
        if(!modules[item]){
            item = global.bridge.resolveName(baseUrl,item);
            hasAll = false;
            if(!pending[item]){
                var fx = function(){
                    define(requires, factory, item);
                };
                pending[item] = fx;
                global.bridge.executeScript(baseUrl, item, fx);
            }
        }
    }

    if(hasAll) {
        var mExports = {};
        factory(require,mExports);
        modules[name || "exports"] = mExports;
    }
}