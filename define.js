var amdLoader = {

    names: {

    },
    
    modules: {
        
        require: function(name){
            var mname = amdLoader.names[name];
            return amdLoader.modules[mname].exports;
        },

        exports: {

        }
    },
    pending: [],
};

function define(requires, factory){

    var modules = amdLoader.modules;

    var currentModule = modules[bridge.baseUrl];
    if(!currentModule){
        // seems first..
        currentModule = {
            name: bridge.baseUrl,
            exports: modules.exports
        };
        modules[bridge.baseUrl] = currentModule;
    }

    var hasAll = true;
    for(var i = 0; i < requires.length ; i++){
        var item = requires[i];
        if(/^(require|exports)$/.test(item)){
            continue;
        }

        item = bridge.resolveName(item);

        var module = modules[item];
        if(!module) {
            amdLoader.names[requires[i]] = item;
            module = {
                name: item,
                exports: {

                }
            };
            modules[item] = module;
        }
        if(module.isLoaded){
            continue;
        } 
        hasAll = false;
        if(!module.isLoading){
            module.isLoading = true;
            var fx = function(){
                var allLoaded = true;
                for(var key in modules) {
                    if(modules.hasOwnProperty(key)){
                        var m = modules[key];
                        if(m.onFinish){
                            m.onFinish();
                        }
                        if(m.isLoaded) {
                            m.onFinish = null;
                            continue;
                        }
                        allLoaded = false;
                    }
                }
                if(allLoaded) {
                    bridge.appLoaded(modules.exports);
                }
            };
            bridge.executeScript(item, fx);
        }
    }

    if (hasAll) {
        factory(modules.require, currentModule.exports);
        currentModule.isLoaded = true;
    } else {
        currentModule.onFinish = function () {
            bridge.baseUrl = currentModule.name;
            define(requires,factory);
        }
    }
}

define.amd = true;