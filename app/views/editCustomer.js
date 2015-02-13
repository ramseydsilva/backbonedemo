define([
    "backbone",
    "handlebars",
    "text!../templates/editCustomerModal.html",
    "text!../templates/domainAliasInput.html"
    
], function(Backbone, HandleBars, template, domainAliasInput) {
    'use strict';
    
    return Backbone.View.extend({
        
        template: HandleBars.compile(template),
        
        events: {
            "click .edit-customer": "editCustomer",
            "click .add-domain-input i": "addDomainInput",
            "click .fa-minus-circle": "removeDomainInput",
            "hidden.bs.modal": "onHide"
        },
        
        initialize: function() {
            this.render();
            this.domainAliasesToDelete = [];
        },

        onHide: function() {
            this.undelegateEvents();    
        },
        
        addDomainInput: function() {
            this.$(".add-domain-input").before(domainAliasInput);
        },
        
        removeDomainInput: function(e) {
            var parent = $(e.target.parentNode);
            if (parent.hasClass("new-domain-alias")) {
                //
            } else {
                var domainId = parent.attr("class").split("da-")[1];
                this.domainAliasesToDelete.push(domainId);
            }
            parent.remove();
        },
        
        editCustomer: function() {
            this.error.text("").addClass("hidden");
            var customerName = this.customerNameInput.val();
            var that = this;
            
            var domainAliasesToAdd = [];
            this.$(".new-domain-alias").each(function(index, e) {
                var val = $(e).find("input").val();
                val && domainAliasesToAdd.push(val);
            });
            
            var domainAliasesToChange = {};
            this.$(".edit-domain-alias").each(function(index, e) {
                var val = $(e).find("input").val();
                var id = $(e).attr("class").split("da-")[1];
                if (val != that.model.domainAliasCollection.get(id).attributes.alias) {
                    domainAliasesToChange[id] = val;
                }
            });
            
            if (customerName && customerName != this.model.get("name")) {
                this.model.save({name: customerName}, {
                    wait: true,
                    silence: true,
                    patch: true,
                    success: function() {
                        that.saveDomainAliases(domainAliasesToAdd, domainAliasesToChange, that.domainAliasesToDelete);
                    },
                    error: function(model, response, responseCode) {
                        that.error.text(response.statusText + ": " + response.responseText).removeClass("hidden");
                    },
                    complete: function() {
                        that.saveButton.removeAttr("disabled");
                        that.loading.addClass("hidden");
                    }
                });
            } else {
                this.saveDomainAliases(domainAliasesToAdd, domainAliasesToChange, this.domainAliasesToDelete);
            }
            
        },
        
        saveDomainAliases: function(toAdd, toChange, toDelete) {
            var that = this;
            toAdd.forEach(function(a) {
                that.model.domainAliasCollection.create({
                    alias: a
                }, {
                    wait: true                     
                });
            });
            _.keys(toChange).forEach(function(key) {
                var da = that.model.domainAliasCollection.get(key);
                da.save({
                    alias: toChange[key]
                }, {
                    wait: true,
                    patch: true
                });
            });
            toDelete.forEach(function(key) {
                var da = that.model.domainAliasCollection.get(key);
                da.destroy({
                    wait: true
                });
            });
            this.undelegateEvents();
            this.$el.modal("hide");
        },
        
        render: function() {
            this.html = $(this.template({
                customerName: this.model.get("name"),
                domainAliases: this.model.domainAliasCollection.models
            }));
            this.$('.modal-body').html(this.html);
            this.saveButton = $('<button type="button" class="btn btn-primary edit-customer">Save</button>');
            this.$('.modal-footer').prepend(this.saveButton);
            this.$('.modal-footer').prepend('<i class="fa fa-refresh fa-spin hidden"></i>');
            this.customerNameInput = this.$('#customer-name');
            this.domainAliasesInput = this.$('#domain-aliases');
            this.loading = this.$('.fa-refresh');
            this.error = this.$('.alert');
        }
        
    });
    
});