define([
    "backbone",
    "handlebars",
    "text!../templates/addCustomer.html",
    "css!font-awesome"
],

function (Backbone, Handlebars, template) {
    "use strict";

    return Backbone.View.extend({
        
        template: Handlebars.compile(template),
        
        events: {
            "click .add-customer": "addCustomer"
        },
        
        initialize: function(options) {
            this.customerCollection = options.customerCollection;
            this.dbCollection = options.dbCollection;            
            this.render();
        },
        
        addCustomer: function() {
            this.error.text("").addClass("hidden");
            var that = this;
            var customerName = this.customerNameInput.val();
            var domainAliases = [];
            this.domainAliasesInput.val().split(",").forEach(function(domainString) {
                if (domainString) {
                    domainAliases.push({
                        "alias": domainString
                    });
                }
            });
            var dbConfiguration = this.$('[name="db-configuration"]:checked').val();
            var stagingDbConfiguration = this.$('[name="staging-db-configuration"]:checked').val();
            
            var toCreate = {};
            
            if (customerName) {
                toCreate.name = customerName;
            }
            
            if (dbConfiguration) {
                toCreate.dbConfiguration = {serverId: dbConfiguration};
            }
            if (stagingDbConfiguration) {
                toCreate.stagingDBConfiguration = {serverId: stagingDbConfiguration};
            }
            
            if (!domainAliases.length) {
                that.error.text("Atleast one domain alias is required").removeClass("hidden");
            } else {
                toCreate.domainAliases = domainAliases;            
                this.loading.removeClass("hidden");
                this.saveButton.attr("disabled", "disabled");
                this.customerCollection.create(toCreate, {
                    wait: true,
                    silence: true,
                    success: function(model, response) {
                        model.init().done(function() {
                            that.$('.modal-body').html("A new customer was successfully created. The admin password is " + model.get("adminUser").password);
                            that.undelegateEvents();
                            that.saveButton.remove();
                        });
                    },
                    error: function(model, response, responseCode) {
                        that.error.text(response.statusText + ": " + response.responseText).removeClass("hidden");
                    },
                    complete: function() {
                        that.saveButton.removeAttr("disabled");
                        that.loading.addClass("hidden");
                    }
                });
            }

        },
        
        render: function() {
            this.html = $(this.template({
                dbs: this.dbCollection.models
            }));
            this.$('.modal-body').html(this.html);
            this.saveButton = $('<button type="button" class="btn btn-primary add-customer">Save</button>');
            this.$('.modal-footer').prepend(this.saveButton);
            this.$('.modal-footer').prepend('<i class="fa fa-refresh fa-spin hidden"></i>');
            this.customerNameInput = this.$('#customer-name');
            this.domainAliasesInput = this.$('#domain-aliases');
            this.loading = this.$('.fa-refresh');
            this.error = this.$('.alert');
        }
        
    });
    
});