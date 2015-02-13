define([
    "../core/authSync",
    "../models/customer"
], function (authSync, CustomerModel) {
    "use strict";
    
    return authSync.Collection.extend({
        
        model: CustomerModel,
        url: authSync.urlRoot + '/admin/customers'
        
    });

});