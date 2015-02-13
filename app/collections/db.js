define([
    "../core/authSync"
], function (authSync) {
    "use strict";
    
    return authSync.Collection.extend({
        
        url: authSync.urlRoot + '/admin/dbServers'
        
    });

});