define([
    "backbone",
    "json!constants",
    "./views/errorPopup",
    "essentials"
],
function (Backbone, Constants, errorPopup, essentials) {
    "use strict";
    
    var authSync,
        isIE = essentials.isIE(),
        auth,
        setup = function(token) {
            auth = token;
        },
        // This function takes the auth token and retrofits `Backbone.sync` to
        // - Send auth token headers with every request
        // - Handle error response from the API, under explicitly handled in your CRUD methods
    
        authSync = function(method, model, options) {
            
            if (!options.headers) {
                options.headers = {
                    Authorization: auth
                };
            }
            if (!options.silence) {
                var error = options.error;
                options.error = function(res) {
                    if (error) error.apply(this, arguments);
                    errorPopup(res);
                }
            }
            
            if (method) {
                if (!model) {
                    // This situation arises when this.sync is called to make a fly ajax request to server
                    model = { trigger: function() {} }; // let's fake a model
                    model.toJSON = model.trigger;
                    if (typeof options.contentType != "boolean") options.contentType = 'application/json';
                    if (options.type != "GET") options.data = JSON.stringify(options.data);

                }
            } else {
                // if no method was specified, just forward to $.ajax
                return $.ajax(options);
            }
            
            if (typeof options.cache != "boolean" && isIE) options.cache = false;
            
            return Backbone.sync(method, model, options);
        },
        
        // Setup our collection/models use authSync
        
        Collection = Backbone.Collection.extend({
            sync: authSync
        }),
        
        Model = Backbone.Model.extend({
            sync: authSync
        });

    return {
        setup: setup,
        sync: authSync,
        Collection: Collection,
        Model: Model,
        urlRoot: Constants.protocol + Constants.server + ":" + Constants.port
    };
    
});