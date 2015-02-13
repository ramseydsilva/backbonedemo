define([
    "../core/authSync",
    "../models/domainAlias"
], function (authSync, DomainAliasModel) {
    "use strict";
    
    return authSync.Collection.extend({

        url: function() {
            return this.customer.url() + "/domainAliases";  
        },
        
        model: DomainAliasModel,
        
        initialize: function(models, options) {
            this.customer = options.customer;
        }
        
    });

});