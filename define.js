var amdLoader = {
    
    modules: {
        
        require: function(name){
            return amdLoader.modules[name].exports;
        },

        exports: {

        }
    },
    pending: [],
};

function define(requires, factory){

    var currentModule = amdLoader.modules[bridge.baseUrl];
    if(!currentModule){
        // seems first..
        currentModule = {
            name: bridge.baseUrl,
            exports: {

            }
        };
        amdLoader.modules[bridge.baseUrl] = currentModule;
    }

    var hasAll = true;
    for(var i = 0; i < requires.length ; i++){
        var item = requires[i];
        if(/^(require|exports)$/.test(item)){
            continue;
        }

        item = bridge.resolveName(item);

        var module = amdLoader.modules[item];
        if(!module) {
            module = {
                name: item,
                exports: {

                }
            };
            amdLoader.modules[item] = module;
        }
        if(module.isLoaded){
            continue;
        } 
        hasAll = false;
        if(!module.isLoading){
            module.isLoading = true;
            var fx = function(){
                bridge.baseUrl = currentModule.name;
                define(requires,factory);
            };
            bridge.executeScript(item, fx);
        }
    }

    if(hasAll) {
        factory(amdLoader.modules.require, currentModule.exports);
        currentModule.isLoaded = true;
    }
}

define.amd = true;