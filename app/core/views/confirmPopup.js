define([
    "backbone",
    "./modal"
],
function (Backbone, ModalView) {    
   "use strict";

    var view = Backbone.View.extend({
        
        events: {
            "click .yes-button": "okNext",
            "click .cancel-button": "cancelNext",
            "keypress": "okNext",
        },                        
        
        initialize: function(options) {
            var that = this;
            if (!options) options = {};
            
            this.modal =  new ModalView({
                title: options.header || "Please confirm",
                body: options.message || "Are you sure you want to proceed?",
                buttons: {
                    'yes': {
                        text: options.okText || "Yes",
                        attr: {
                            class: 'yes-button btn btn-success'
                        }
                    },
                    'cancel': {
                        text: options.cancelText || "Cancel",
                        attr: {
                            class: 'cancel-button btn btn-default',
                            'data-dismiss': "modal"
                        }
                    }
                },
                onHide: function() {
                    that.undelegateEvents();
                }
            });
            this.setElement(this.modal.$el);
            this.okPromise = $.Deferred();
            this.ok = this.okPromise.done;
            this.cancelPromise = $.Deferred();
            this.cancel = this.cancelPromise.done;
            
            return this;
        },
        
        okNext: function(e) {
            if (e.type == "click" || e.keyCode == 13) {
                this.okPromise.resolve();                
            }
            this.$el.modal("hide");
            this.$el.off("keypress");
        },
        
        cancelNext: function(e) {
            
            if (e.type == "click") {
                this.cancelPromise.resolve();
            }
            this.$el.modal("hide");
            this.$el.off("keypress");
        }
        
    });
    
    return view;
    
});