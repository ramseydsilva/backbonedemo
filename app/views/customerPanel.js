define([
    "backbone",
    "handlebars",
    "text!../templates/customerPanel.html",
    "../collections/customer",
    "../collections/db",
    "../core/views/pagination/view",
    "./customer",
    "../core/views/modal",
    "./addCustomer",
    "css!../static/css/customer.css"
    
], function(Backbone, HandleBars, template, CustomerCollection, DbCollection,
                PaginationView, CustomerItemView, ModalView, AddCustomeModalView) {
    'use strict';
    
    return Backbone.View.extend({
        
        template: HandleBars.compile(template),
        
        events: {
            "click .add-customer": "showAddCustomerModal",
            'keyup input.searchCustomers': 'searchCustomers'
        },
        
        initialize: function(options) {
            var that = this;
            this.render();
            this.customerPaginationView = new PaginationView({
                el: this.customerTable,
                appendAction: 'prepend',
                pageLength: 15,
                columns: {
                    'ID': {
                        width: '5%'
                    },
                    'Status': {
                        width: '5%'
                    },
                    'Customer Name': {
                        width: '10%'
                    },
                    'DB': {
                        width: '15%'
                    },
                    'Type': {
                        width: '10%'
                    },
                    'Host': {
                        width: '10%'
                    },
                    'Domain Alias': {
                        width: '15%'
                    },
                    'Admin User': {
                        width: '10%'
                    },
                    'Admin Password': {
                        width: '10%'
                    },
                    'Actions': {
                        width: '10%',
                        class: 'text-right'
                    }
                },
                onAdd: function(view) {
                    
                },
                actions: {
                    'Add Customer': {
                        class: 'add-customer',
                        icon: 'glyphicon glyphicon-plus'
                    }
                },                
                noDataMessage: 'Loading customers...'
            });
            
            this.customerCollection = new CustomerCollection();
            this.dbCollection = new DbCollection();
            this.listenTo(this.customerCollection, "add", this.addCustomerToList);
            this.customerCollection.fetch();
            this.dbCollection.fetch();
        },
        
        searchCustomers: function(e) {
            var searchTerm = e.currentTarget.value;
            if (searchTerm) {
                this.customerPaginationView.search(searchTerm);
            } else {
                this.customerPaginationView.navigateToPage(1);
            }
        },
        
        showAddCustomerModal: function() {
            var modal = new ModalView({
                title: 'Add Customer'
            });
            if (this.addCustomeModalView) {
                this.addCustomeModalView.undelegateEvents();
            }
            this.addCustomeModalView = new AddCustomeModalView({
                el: modal.$el,
                customerCollection: this.customerCollection,
                dbCollection: this.dbCollection
            });
        },
        
        addCustomerToList: function(model) {
            if (!model.view) {
                model.view = new CustomerItemView({
                    model: model,
                    tagName: 'tr'
                });
            }
            this.customerPaginationView.add(model.view);
            this.customerPaginationView.navigateToPage(1);
        },
        
        render: function() {
            this.html = $(this.template());
            this.$el.html(this.html);
            this.customerTable = this.$('.customerTable');
            return this;
        }
        
    });
    
});