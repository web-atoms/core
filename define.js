var amdLoader = {

    root: null,

    names: {

    },
    
    modules: {
        
        exports: {

        }
    },
    pending: [],

    finish: function(){
        var allLoaded = true;
        var modules = amdLoader.modules;
        for(var key in modules) {
            if(/^(require|exports)$/.test(key)){
                continue;
            }
            if(modules.hasOwnProperty(key)){
                var m = modules[key];
                if(m.isLoaded) {
                    continue;
                }
                allLoaded = false;
            }
        }
        if(allLoaded) {
            if(!amdLoader.root.initialized){
                amdLoader.root.factory(amdLoader.root.require,amdLoader.root.exports);
                amdLoader.root.initialized = true;
                bridge.appLoaded(amdLoader.root.require, amdLoader.root.exports);
            }
        }
    }
};

function define(requires, factory){

    var modules = amdLoader.modules;

    var currentModule = modules[bridge.baseUrl];
    if(!currentModule){
        // seems first..
        currentModule = {
            name: bridge.baseUrl,
            exports: modules.exports,
        };
        modules[bridge.baseUrl] = currentModule;
        amdLoader.root = currentModule;
    }

    if(!currentModule.require) {
        var currentBaseUrl = bridge.baseUrl;
        currentModule.require = function(name){
            var resolvedName = bridge.resolveName(currentBaseUrl, name);
            var resolvedModule = amdLoader.modules[resolvedName];
            if(!resolvedModule.initialized){
                resolvedModule.factory(resolvedModule.require,resolvedModule.exports);
                resolvedModule.initialized = true;
            }
            return resolvedModule.exports;
        };
    }

    var hasAll = true;
    for(var i = 0; i < requires.length ; i++){
        var item = requires[i];
        if(/^(require|exports)$/.test(item)){
            continue;
        }

        item = bridge.resolveName(bridge.baseUrl, item);

        var module = modules[item];
        if(!module) {
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
            bridge.executeScript(item, amdLoader.finish);
        }
    }

    currentModule.isLoaded = true;
    currentModule.factory = factory;
    amdLoader.finish();
}

amdLoader.import = function(name) {

};

define.amd = true;

Array.prototype.find = function(fx) {
    for(var i=0;i<this.length;i++){
        var item = this[i];
        if(fx(item))
            return item;
    }
}