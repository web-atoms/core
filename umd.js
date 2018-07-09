// this file helps in mapping umd module names to path

var UMD = {

    viewPrefix: "web",

    mapConfig: {

    },

    map: function(config, configValue) {
        if (typeof config === "object") {
            for (const key in config) {
                if (config.hasOwnProperty(key)) {
                    const element = config[key];
                    this.mapConfig[key] = element;
                }
            }
            return;
        }
        this.mapConfig[config] = configValue;
    },

    resolveViewPath: function(path) {
        return path.replace("{platform}", this.viewPrefix);
    },

    resolveViewClassAsync: function(path) {
        path = this.resolveViewPath(path);
        return new Promise(function (resolve, reject) {
            SystemJS.import(path)
                .then(function(r) {
                    resolve(r.default);
                })
                .catch(function(r) {
                    reject(r);
                });
        });
    },

    setup: function() {
        var config = {
            map: {},
            meta: {

            },
            packages: {
                '.': {
                    defaultExtensions: "js",
                    format: "amd"
                }
            }
        };

        for (const key in this.mapConfig) {
            if (this.mapConfig.hasOwnProperty(key)) {
                const element = this.mapConfig[key];
                config.map[key] = element;
            }
        }

        config.meta[config.map["reflect-metadata"]] = {
            format: "global",
            exports: "Reflect"
        };

        SystemJS.config(config);

        this._initialized = true;
    },

    load: function(path) {
        if (!this._initialized) {
            this.setup();
        }

        SystemJS.import(path);
    }
};

