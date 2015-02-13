define([
    "backbone",
    "handlebars",
    "underscore",
    "text!./template.html"
], function(Backbone, HandleBars, _, template) {
    'use strict';

    var view = Backbone.View.extend({
        
        currentPage: 1,
        appendAction: 'append',
        template: HandleBars.compile(template),        
        pageLength: 20,
        noDataMessage: 'No results for this query.',
        noSearchResultMessage: 'No matching results for your search.',
        onAdd: function() {},
        onRemove: function() {},
        
        events: {
            'click .pagination a': 'navigateToPage'
        },
        
        initialize: function(options) {
            this.columns = {};
            this.pages = [];
            this.actions = {};
            this.items = [];
            
            // sanity check the supplied options
            if (options && options.el) delete options.el;
            if (options && options.pages) delete options.pages;
            if (options && options.items) delete options.items;
            
            _.extend(this, options);
            this.render();
        },

        showNoData: function(tableClass) {
            if (!tableClass) tableClass = 'no-data';
            this.$('tbody.'+tableClass).removeClass("hidden");
        },

        hideNoData: function(tableClass) {
            if (!tableClass) tableClass = 'no-data';
            this.$('tbody.'+tableClass).addClass("hidden");
        },
        
        enableDisablePreviousNext: function(page) {
            if (page == 1) {
                this.$('.pagination .previous').addClass('disabled').find('a').attr("page", "");
            } else if (this.pages.length > 1) {
                this.$('.pagination .previous').removeClass('disabled').find('a').attr("page", page-1);
            }
            if (page < this.pages.length) {
                this.$('.pagination .next').removeClass('disabled').find('a').attr("page", page+1);
            } else {
                this.$('.pagination .next').addClass('disabled').find('a').attr("page", "");
            }            
        },
        
        navigateToPage: function(e) {
            var page = typeof e == "number" ? e: parseInt(this.$(e.currentTarget).attr("page"));
            if (page) {
                this.$('tbody.data tr').hide();            
                this.$('tbody.data tr').slice((page-1)*this.pageLength, page*this.pageLength).show();
                this.$('.pagination .active').removeClass('active');
                this.$('.pagination .paginate_page a[page="' + page + '"]').parent().addClass('active');
                this.enableDisablePreviousNext(page);
                this.currentPage = page;
            }
        },
        
        adjustPages: function(view, items, noDataTableClass) {
            var page = Math.ceil((items.indexOf(view) + 1)/this.pageLength);
            if (page != this.currentPage) {
                view.$el.hide();
            } else {
                view.$el.show();
            }
            
            this.enableDisablePreviousNext(this.currentPage);

            if (page > 0 && this.pages.indexOf(page) == -1) {
                var extraClass = '';
                if (page == this.currentPage) extraClass = 'active';
                this.pages.push(page);
                this.$('.pagination .next').before('<li class="paginate_button paginate_page ' + extraClass + '"><a page="' + page
                    + '">' + page + '</a></li>');
            }

            var lastPage = Math.ceil(items.length/this.pageLength);
            if (this.pages.length && _.last(this.pages) > lastPage) {
                var removedPage = this.pages.pop(this.pages.length-1);
                if (this.currentPage > 1 && this.currentPage == removedPage) {
                    // if current page is greater than the number of pages, go back one page
                    this.currentPage -= 1;
                }
                this.$('.pagination .paginate_page a[page="' + removedPage + '"]').remove();
            }
            
            if (items.length == 0) {
                this.showNoData(noDataTableClass);
            } else {
                this.hideNoData(noDataTableClass);
            }
            
            this.renderPagination();
            
        },
        
        renderPagination: function() {
            if (this.pages.length <= 1) {                
                this.$('.pagination').hide();
                return false;
            } else {
                this.$('.pagination').show();
                return true;
            }                
        },

        addToDom: function(view) {
            this.$('tbody.data')[this.appendAction](view.el);
            this.onAdd(view);
            this.adjustPages(view, this.items);
            if (view.undelegatedEvents) view.delegateEvents();   
        },
        
        removeFromDom: function(view) {
            view.remove();
            this.onRemove(view);
            this.adjustPages(view, this.items);
            view.undelegatedEvents = true;            
        },
        
        addOrRemoveFromDom: function(view) {
            if (this.items.indexOf(view) == -1) {
                this.removeFromDom(view);
            } else {
                this.addToDom(view);
            }            
        },
        
        remove: function(view) {
            if (!view) {
                // If no view specified, remove the pagination view
                Backbone.View.prototype.remove.call(this);
            } else {
                this.items.splice(this.items.indexOf(view), 1);
                this.removeFromDom(view);
            }
        },
        
        setSearchText: function(view) {
            view.searchText = view.$el.text().toLowerCase();
        },
        
        add: function(view) {
            if (!view.searchText) this.setSearchText(view);
            this.items.push(view);
            this.addToDom(view);
        },
        
        search: function(val) {
            var that = this;
            var searchResults = this.items.filter(function(view) {
                return view.searchText.indexOf(val.toLowerCase()) != -1
            });
            this.items.forEach(function(view) {
                that.adjustPages(view, searchResults, 'no-search-data'); 
            });            
        },
        
        render: function () {            
            this.$el.html(this.template({
                colspan: _.keys(this.columns).length,
                columns: this.columns,
                actions: this.actions,
                noDataMessage: this.noDataMessage,
                noSearchResultMessage: this.noSearchResultMessage
            }));
            this.renderPagination();
            return this;
        }
        
    });
    
    return view;
    
});