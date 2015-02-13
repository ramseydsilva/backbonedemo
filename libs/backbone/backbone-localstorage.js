(function(root, Backbone){
    
    var prefix = 'unknown';
    var version = '';
    
    // Save the previous value of the `Backbone.sync` method, so that it can be called later on.
    var previousSync = root.Backbone.sync;
    
    // Save a reference to the global Backbone object
    var Localstorage = root.Backbone.Localstorage = {};
    
    // Current version of the library. Keep in sync with `package.json` and `bower.json`.
    Localstorage.VERSION = '0.3.1';
    
    /**
     * @param {string}
     * @param {object}
    */
    Localstorage._setData = function(id, value){
        root.localStorage.setItem(prefix+':'+id, JSON.stringify(value));
    };
    
    /**
     * @param {string}
    */
    Localstorage._removeData = function(id) {
        root.localStorage.removeItem(prefix+':'+id);
    };
    
    /**
     * @param {string}
     * @return {object}
     */
    Localstorage._getData = function(id){
        var data = root.localStorage.getItem(prefix+':'+id);
        
        return typeof data === 'string' ? JSON.parse(data) : data;
    };
    
    /**
     * @param {boolean}
     */
    Localstorage._clear = function(ignorePrefixCondition){
        if (!ignorePrefixCondition){
            for(var prop in root.localStorage) {
                if(prop.indexOf(prefix) === 0) {
                    root.localStorage.removeItem(prop);
                }
            }
        }
        else {
            root.localStorage.clear();
        }
    };
    
    /**
     * @param {string}
     * @param {Backbone.Model}
     * @param {object}
     */
    Localstorage.sync = function(method, model, options){
        var id;
        
        if (method === 'read' && ((typeof this.Localstorage === 'object') || (this.Localstorage !== undefined && this.Localstorage !== null && this.Localstorage.toString().toLowerCase() === 'true'))){
            // Retrieve unique id under which the data will be stored, if no id found use the id of the model
            id = _.result(model, 'url');
            
            // Retrieve timestamp from Localstorage
            var timestamp = Localstorage._getData(id+':timestamp');
            
            if (id !== undefined && id !== null){
                var data = Localstorage._getData(id);
                
                if (data === null || data === undefined || options.forceRefresh || (timestamp !== undefined && model.Localstorage.maxRefresh && (((new Date().getTime()) - timestamp) > model.Localstorage.maxRefresh))){
                    var success = options.success;
                    
                    options.success = function(response, status, xhr){
                        try{
                            Localstorage._setData(id, response);
                            Localstorage._setData(id+':timestamp', new Date().getTime());
                        }
                        catch(err){
                            if(err === QUOTA_EXCEEDED_ERR){
                                Localstorage._clear();
                            }
                        }
                        
                        if (success){
                            success.apply(this, arguments);
                        }
                    };
                    
                    return previousSync.apply(this, [method, model, options]);
                    
                } else {
                    // retrieved from local storage successfully, deliver results
                    options.success.apply(this, [data, 'success', {'localstorage': true }]);
                    
                    // proceed to load fresh data from server
                    return previousSync.apply(this, arguments)
                        .success(function(response, status, xhr) {
                            Localstorage._setData(id, response);
                            Localstorage._setData(id+':timestamp', new Date().getTime());                            
                        })
                        .fail(function() {
                            // failed, lets remove previous data
                            Localstorage._removeData(id);
                        });
                }
            } else {
                return previousSync.apply(this, arguments);
            }
        } else {
            if (method == 'delete') {
                id = _.result(model, 'url');
                Localstorage._removeData(id);
            }
            // not a read operation, bypass local storage
            return previousSync.apply(this, arguments);
        }
    };
    
    /**
     * @param {string}
     */
    Localstorage.setVersion = function(value){
        var versionInStorage = Localstorage._getData('version');
        
        // clear Localstorage (only prefixed data) if version differs
        if (versionInStorage !== null && versionInStorage !== value){
            Localstorage._clear(false);
        }
        
        // store new version in storage
        Localstorage._setData('version', value);
        
        version = value;
    };
    
    /**
     * @return {string}
     */
    Localstorage.getVersion = function(){
        return version;
    };
    
    /**
     * @param {string}
     */
    Localstorage.setPrefix = function(value){
        prefix = value;
    };
    
    /**
     * @return {string}
     */
    Localstorage.getPrefix = function(){
        return prefix;
    };
    
    /**
     * @return {boolean}
     */
    Localstorage.isSupported = function(){
        try { 
            var supported = root.localStorage !== undefined;
            
            if (supported){
                localStorage.setItem('storage', '');
                localStorage.removeItem('storage');
            }
            
            return supported;
        }
        catch(err){
            return false;
        }
    };
    
    // Override Backbone.sync method when Localstorage is supported.
    if (Localstorage.isSupported()){
        root.Backbone.sync = Localstorage.sync;
    }
    
}).call(this, window, Backbone);