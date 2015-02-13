define([
    "../core/authSync",
    "../collections/domainAliases"
], function (authSync, DomainAliasCollection) {
    "use strict";

    return authSync.Model.extend({
        
        setUrls: function() {
            this.initUrl = this.url() + '/init';
            this.enableUrl = this.url() + '/enable';
            this.disableUrl = this.url() + '/disable';
            this.resetPasswordUrl = this.url() + '/reset';
        },
        
        initialize: function() {
            this.id && this.setUrls();
            this.setDomainAliasesString();            
            this.on("change:id", this.setUrls, this);
            this.on("add", this.setDomainAliasesString, this);
            this.on("change:domainAliases", this.setDomainAliasesString, this);
            this.domainAliasCollection.on("change add remove", this.setDomainAliasesString, this);
        },        
        
        initDomainAliasesCollection: function() {
            this.domainAliasCollection = new DomainAliasCollection(this.attributes.domainAliases, {customer: this});
        },
        
        setDomainAliasesString: function() {
            var that = this;
            if (!this.domainAliasCollection) {
                this.initDomainAliasesCollection();
            } else {
                this.attributes.domainAliases.forEach(function(a) {
                    var da = that.domainAliasCollection.findWhere({alias: a.alias});
                    da && da.set(a);
                });
                
            }
            var domainAliases = "";
            this.domainAliasCollection.each(function(model) {
                domainAliases += ", " + model.attributes.alias
            });
            this.set("domainAliasesString", domainAliases.slice(2, domainAliases.length));
        },
        
        init: function() {
            var that = this;
            return this.sync('create', null, {
                url: this.initUrl,
                success: function(userObject, response) {
                    that.set("adminUser", userObject);
                }
            });
        },
        
        enable: function() {
            var that = this;
            if (!this.get("enabled")) {
                return this.sync('create', null, {
                    url: this.enableUrl,
                    success: function(userObject, response) {
                        that.set("enabled", true);
                    }
                });
            }
        },
        
        disable: function() {
            var that = this;
            if (this.get("enabled")) {
                return this.sync('create', null, {
                    url: this.disableUrl,
                    success: function(userObject, response) {
                        that.set("enabled", false);
                    }
                });                
            }
        },
        
        resetPassword: function() {
            var that = this;
            return this.sync("create", null, {
                url: this.resetPasswordUrl,
                success: function(adminUser) {
                    that.set("adminUser", adminUser);
                }
            });
        }
        
    });

});