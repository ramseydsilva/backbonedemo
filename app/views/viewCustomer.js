define([
    "backbone"
    
], function(Backbone) {
    'use strict';
    
    function syntaxHighlight(json) {
        if (typeof json != 'string') {
             json = JSON.stringify(json, undefined, 2);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }
    
    return Backbone.View.extend({
                
        initialize: function() {
            this.render();
        },

        render: function() {
            if (!this.html) {
                this.html = document.createElement("pre");
                this.html.innerHTML = syntaxHighlight(JSON.stringify(this.model.attributes, undefined, 2));
            }
            this.$('.modal-body').html(this.html);
        }
        
    });
    
});