define([
    "backbone",
    "handlebars",
    "text!../templates/customer.html",
    "../core/views/modal",
    "../core/views/confirmPopup",
    "./viewCustomer",
    "./editCustomer"
    
], function(Backbone, HandleBars, template, ModalView, confirmPopup, ViewCustomerView, EditCustomerView) {
    'use strict';
    
    return Backbone.View.extend({
        
        template: HandleBars.compile(template),
        
        events: {
            "click .glyphicon-eye-open": "preview",
            "click .glyphicon-pencil": "edit",
            "click .fa-key": "resetPassword",
            "click .glyphicon-ok": "enable",
            "click .glyphicon-remove": "disable"
        },
        
        initialize: function() {
            this.render();
            this.listenTo(this.model, "change", this.render);
        },
        
        preview: function() {
            var modal = new ModalView({
                title: 'View Customer',
                width: "1000px"
            });
            new ViewCustomerView({
                el: modal.$el,
                model: this.model
            });
        },

        edit: function() {
            var modal = new ModalView({
                title: 'Edit Customer'
            });
            new EditCustomerView({
                el: modal.$el,
                model: this.model
            });
        },
        
        resetPassword: function() {
            var that = this;
            var confirm = new confirmPopup({
                message: "Are you sure you want to reset Password for customer '" + this.model.get("name") + "'?"
            });
            confirm.ok(function() {
                that.model.resetPassword();
            });
        },
        
        enable: function() {
            var that = this;
            var confirm = new confirmPopup({
                message: "Are you sure you want to enable customer '" + this.model.get("name") + "'?"
            });
            confirm.ok(function() {
                that.model.enable();
            });
        },
        
        disable: function() {
            var that = this;
            var confirm = new confirmPopup({
                message: "Are you sure you want to disable customer '" + this.model.get("name") + "'?"
            });
            confirm.ok(function() {
                that.model.disable();
            });            
        },
        
        render: function() {            
            this.html = $(this.template({
                id: this.model.get("id"),
                status: this.model.get("enabled") ? "Active": "InActive",
                enabled: this.model.get("enabled"),
                customerName: this.model.get("name"),
                host: this.model.get("dbConfiguration").server.host,
                db: this.model.get("dbConfiguration").databaseName,
                type: this.model.get("dbConfiguration").server.driver.type,
                domainAliases: this.model.get("domainAliasesString"),
                adminUser: this.model.get("adminUser") ? this.model.get("adminUser").email: "",
                adminPassword: this.model.get("adminUser") ? this.model.get("adminUser").password: ""
            }));
            this.$el.html(this.html);
            this.searchText = this.$el.text().toLowerCase();
        }
        
    });
  
});