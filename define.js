var amdLoader = {
    
    modules: {
        
        require: function(name){
            return amdLoader.modules[name];
        },

        exports: {

        }
    },
    pending: {

    },
};

function define(requires, factory, name){
    var hasAll = true;
    for(var i = 0; i < requires.length ; i++){
        var item = requires[i];
        if(!/^(require|exports)$/.test(item)){
            item = name || bridge.resolveName(item);
        }
        if(!amdLoader.modules[item]){
            hasAll = false;
            if(!amdLoader.pending[item]){
                var fx = function(){
                    define(requires, factory, item);
                };
                amdLoader.pending[item] = fx;
                bridge.executeScript(item, fx);
            }
        }
    }

    if(hasAll) {
        var mExports = {};
        factory(amdLoader.require, mExports);
        amdLoader.modules[name || "exports"] = mExports;

        if(!name) {
            // all modules are loaded...
            bridge.appLoaded(mExports);
        }
    }
}

define.amd = true;