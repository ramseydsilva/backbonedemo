define([
    'backbone',
    'handlebars',
    'underscore',
    'jquery',
    'text!../templates/modal.html',
    "bootstrap"
], function(Backbone, Handlebars, _, $, template) {
    
    var modalZIndex = 0;
    var view = Backbone.View.extend({
        template: Handlebars.compile(template),
        el: $('#modal'),
        
        events: {
            "shown.bs.modal": "onShow"
        },
        
        initialize: function(options) {
            this.defaults = {
                title: 'Title',
                body: '',
                modal: {}
            };
            _.extend(this.defaults, options);
            this.onHideExtra = options.onHide;
            this.onShowExtra = options.onShow;
            this.returnFocusTo = document.activeElement;
            this.render();
        },

        onHide: function(e) {
            this.onHideExtra && this.onHideExtra();
            this.returnFocusTo.focus();
            var backdrops = $('.modal-backdrop');
            if (backdrops.length) {
                backdrops.remove();
            }
            this.$el.off("hidden.bs.modal");
        },
        
        adjustZIndex: function() {
            if (!modalZIndex)
                modalZIndex = parseInt(this.$el.css('z-index'));
            else
                this.$el.css('z-index', modalZIndex);
            modalZIndex+=1;            
        },
        
        onShow: function(e) {
            var that = this;
            this.onShowExtra && this.onShowExtra();
            var backdrops = $('.modal-backdrop');
            if (!backdrops.length) {
                $('body').append('<div class="modal-backdrop fade in"></div>');
            }
            this.$el.off("shown.bs.modal");
            this.$el.on("hidden.bs.modal", function() {
                that.onHide();
            });
            this.$el.show();
        },
        
        render: function() {
            this.rendered = this.template(this.defaults);
            this.$el.html(this.rendered);
            this.adjustZIndex();
            this.$el.modal(this.defaults.modal);
        },
        
        close: function() {
            this.undelegateEvents();
            this.$el.modal("hide");
        }
    });
    
    return view;
    
})