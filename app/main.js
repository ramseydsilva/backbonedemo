define([
    "./config"    
], function(config) {

    var isProd = require.toUrl('.').indexOf('build') > 0;
    if (isProd) {
        var extraConfig = {
            bundles: {
                backbonedemo: ['./controller']
            }
        };
        require.config(extraConfig);
    }
    
    window.app = {
        rootUrl: "/"
    }
    
    require(['backbonedemo']);
    
});
