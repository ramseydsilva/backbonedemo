define(function() {
    return require.config({
        version: "1.0.0",            
        waitSeconds: 30,
        paths: {                
                jquery: "../libs/jquery/jquery-1.11.1",
                underscore: "../libs/lodash.compat",
                backbone: "../libs/backbone/backbone",
                bootstrap: "../libs/bootstrap/js/bootstrap-3.1.0.min",
                handlebars: "../libs/handlebars",
                constants: "constants.json",
                text: "../libs/requirejs/plugins/text",
                essentials: "../libs/essentials",
                json: "../libs/requirejs/plugins/json",
                "require-css": "../libs/requirejs/plugins/require-css/css",
                "font-awesome": "../libs/font-awesome-4.1.0/css/font-awesome",
                
                // for build system
                "css-builder": "../libs/requirejs/plugins/require-css/css-builder",
                normalize: "../libs/requirejs/plugins/require-css/normalize",
                
                backbonedemo: "./controller"
                
        },       
        map: {
            "*": { "css": "require-css" }
        },
        shim: {
            "backbone": {
                exports: "Backbone",
                deps: ["underscore", "jquery"]
            },
            "bootstrap": {
                deps: ["jquery"]
            },
            "handlebars": {
                exports: "Handlebars"
            },
            "jquery": {
                exports: "jQuery"
            },
            "underscore": {
                exports: "_"
            }
        }
    });
});
