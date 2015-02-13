define([
    "backbone",
    "handlebars",
    "text!../templates/loginPanel.html",
    "./customerPanel",
    "../core/authSync",
    "css!../static/css/loading-panel.css"
], function(Backbone, HandleBars, template, CustomersView, authSync) {
    'use strict';
    
    var username, password;
    
    return Backbone.View.extend({
        
        template: HandleBars.compile(template),

        events: {
            "submit form": "login"
        },
                
        initialize: function(options) {
            this.user = options.user;
            this.render();
        },
        
        login: function(e) {
            e.preventDefault();
            username = this.emailInput.val();
            password = this.passwordInput.val();
            var credentials = username + ":" + password;
            var authToken = btoa(credentials);
            authSync.setup("VenaBasic " + authToken);
            var customersView = new CustomersView({
                el: this.$el
            });
            $(".logout").removeClass("hidden");
        },
        
        render: function() {
            this.html = $(this.template());
            this.$el.html(this.html);
            this.emailInput = this.$("#email");
            this.passwordInput = this.$("#password");
            this.errorText = this.$('#loginError');
            return this;
        }
        
    });
    
});