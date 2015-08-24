"use strict";

var _ = require("substance/helpers");
var View = require("substance-application").View;
var $$ = require("substance-application").$$;
var SearchbarView = require("./searchbar_view");
var PreviewView = require("./preview_view");
// var FacetsView = require("./facets_view");
var util = require("./util");

// React Component
var TreeComponent = require("../shared/components/tree");



// Browser.View Constructor
// ========
//

var BrowserView = function(controller) {
  View.call(this);

  this.controller = controller;
  this.$el.attr({id: "container"});

  // Elements
  // --------

  // Search bar
  // ------------

  this.searchbarView = new SearchbarView(this.controller, {
    getSuggestions: _.bind(this.controller.getSuggestions, this.controller)
  });

  // List of found documents
  // ------------
  // 

  this.facetsEl = $$('#facets');
  this.documentsEl = $$('#documents');
  this.documentsEl.appendChild($$('.no-result', {text: "Loading documents ..."}));

  this.previewEl = $$('#preview');

  this.modalEl = $$('#modal.modal.hidden');

  // Wrap what we have into a panel wrapper
  this.panelWrapperEl = $$('.panel-wrapper');
  this.panelWrapperEl.appendChild(this.facetsEl);
  this.panelWrapperEl.appendChild(this.documentsEl);
  this.panelWrapperEl.appendChild(this.previewEl);
  
  // Loading spinner
  this.progressbarEl = $$('.progress-bar', {
    html: '<div class="progress loading"></div>'
  });

  // Event handlers
  // ------------

  this.$el.on('click', '.available-facets .value', _.bind(this.toggleFilter, this));
  this.$el.on('click', '.document .toggle-preview', _.bind(this.togglePreview, this));

  // commenting this out cause we need to use it as link
  //this.$el.on('click', '.document .filter a', _.bind(this.toggleFilter, this));

  this.$el.on('click', '.toggle-details', _.bind(this.toggleDetails, this));

  $(this.facetsEl).on('click', _.bind(this.blockFiltering, this));

  // Each time the search query changes we re-render the facets panel
  // this.controller.searchQuery.on('query:changed', _.bind(this.renderFacets, this));
};

BrowserView.Prototype = function() {

  this.blockFiltering = function(e) {
    if (this.loading) {
      e.preventDefault();
      e.stopPropagation();      
    }
  };


  this._preventDefault = function(e) {
    e.preventDefault();
  };

  this.togglePreview = function(e) {
    e.preventDefault();

    var searchQuery = this.controller.searchQuery;
    var $documentEl = $(e.currentTarget).parent();
    var documentId = $documentEl.attr('data-id');
    var self = this;

    var $preview = $documentEl.find('.preview');
    if ($preview.length > 0) {
      $preview.toggle();
    } else {
      this.showLoading();
      this.controller.loadPreview(documentId, searchQuery.searchStr, function(err) {
        self.renderPreview();
        self.hideLoading();
      });
    }
  };

  this.toggleFilter = function(e) {
    e.preventDefault();
    var facet = $(e.currentTarget).attr("data-facet");
    var facetValue = $(e.currentTarget).attr("data-value");
    this.controller.searchQuery.toggleFilter(facet, facetValue);
  };

  this.addEntityFilter = function(e) {
    e.preventDefault();
    var facet = $(e.currentTarget).attr("data-facet");
    var facetValue = $(e.currentTarget).attr("data-value");

    this.controller.searchQuery.toggleFilter(facet, facetValue);
  };

  // Show the loading indicator
  this.showLoading = function() {
    this.loading = true;
    $('.progress-bar').removeClass('done loading').show();
    $('#facets').addClass('disabled');
    _.delay(function() {
      $('.progress-bar').addClass('loading');
    }, 10);
  };

  // Hide the loading indicator
  this.hideLoading = function() {
    $(this.loadingEl).hide();
    this.loading = false;

    $('#facets').removeClass('disabled');
    $('.progress-bar').addClass('done');

    _.delay(function() {
      $('.progress-bar').hide();
    }, 1000);
  };

  // Rendering
  // ==========================================================================
  //

  // After state transition
  // --------------
  // 

  this.afterTransition = function(oldState, newState) {
    if (newState.id === "main") {
      if (!_.isEqual(newState.searchQuery, oldState.searchQuery)) {
        this.renderSearchResult();
        this.hideLoading();
      }
    }
  };

  this.renderPreview = function() {
    var previewData = this.controller.previewData;
    var documentId = previewData.document.id;

    if (this.controller.previewData) {
      var previewEl = new PreviewView(previewData);

      // Highlight previewed document in result list
      this.$('.document').each(function() {
        if (documentId === this.dataset.id) {
          this.appendChild(previewEl.render().el);
        }
      });
    }
  };

  // Shows a popup
  this.renderDetails = function() {
    // TODO:
    console.log('rendering modal...');

    var modalBodyEl = $$('.body', {
      children: [
        $$('.header.toolbar.clearfix.menubar.fill-light', {
          html: '<div class="title float-left large">Details</div><div class="menu-group small"></div><button class="button toggle-details float-right"><i class="fa fa-close"></i></button>'
        }),
        $$('.content', {text: 'DETAIL_VIEW CONTENT GOES HERE'})
      ]
    });

    this.modalEl.appendChild(modalBodyEl);
  };

  this.renderFacets = function() {
    // this.facetsView = new FacetsView(this.controller.searchResult.getFacets());
    // this.facetsEl.innerHTML = "";
    // this.facetsEl.appendChild(this.facetsView.render().el);

    // Subjects Filters
    // -------------
    // 

    var subjectFilters = this.controller.state.searchQuery.filters["subjects"] || [];
    React.render(
      React.createElement(TreeComponent, {
        selectedNodes: subjectFilters,
        tree: this.controller.searchResult.subjects.getTree(),
        counts: this.controller.searchResult.getFacetCounts("subjects"),
        onSelectionChanged: function(selectedNodes) {
          var selectedSubjects = Object.keys(selectedNodes);
          console.log('selected nodes', selectedSubjects);
          this.controller.searchQuery.setFilter("subjects", selectedSubjects);
        }.bind(this)
      }),
      this.facetsEl
    );
  };

  this.getName = function(id) {
    return this.controller.getName(id);
  };

  // Display initial search result
  this.renderSearchResult = function() {
    var searchQuery = this.controller.state.searchQuery;
    var searchResult = this.controller.searchResult;
    var searchStr = searchQuery.searchStr;
    var filters = searchQuery.filters;

    // Check if there's an actual search result
    if (!this.controller.searchResult) return;

    this.documentsEl.innerHTML = "";

    // Get filtered documents
    var documents = searchResult.getDocuments();
    var searchMetrics = searchResult.getSearchMetrics();
    
    if (documents.length > 0) {

      this.documentsEl.appendChild($$('.no-result', {text: searchMetrics.hits + " articles found"}));

      _.each(documents, function(doc, index) {

        // Matching filters
        // --------------

        var filtersEl = $$('.filters');

        _.each(doc.facets, function(facet, facetKey) {
          _.each(facet, function(count, id) {
            var type = "subjects"; // TODO: determine based on object type
            var filterEl = $$('.filter', {
              // text: this.getName(id)+' ('+count+')'
              children: [
                $$('a', {href: '/documents/'+doc.id+'#contextId=subjects;subjectId='+id, target: "_blank", text: this.getName(id)+' ('+count+')'})
              ]
              // children: [
              //   $$('i.fa.fa-check-square-o'),
              //   // $$('a', {"data-facet": facetKey, "data-value": id, href: '#', text: this.getName(id)+' ('+count+')'})
              // ]
            });
            filtersEl.appendChild(filterEl);
          }, this);
        }, this);

        // Suggested filters
        // --------------

        _.each(doc.suggestedEntities, function(entity, id) {
            // If not already filtered, display suggestion
            if (!searchResult.isSelected('entities', id)) {
              var filterEl = $$('.filter', {
                children: [
                  $$('i.fa.fa-square-o'),
                  $$('a', {"data-facet": "entities", "data-value": id, href: '#', text: entity.name})
                ]
              });
              filtersEl.appendChild(filterEl);
            }
        });

        var elems = [
          $$('.meta-info', {
            children: [
              // $$('.article-type.'+ARTICLE_TYPES[doc.article_type], {html: doc.article_type+" "}),
              // $$('.doi', {html: doc.doi+" "}),
              $$('.published-on', {text: "published on "+ util.formatDate(doc.published_on)})
            ]
          }),
          $$('.title', {
            children: [
              $$('a', { href: '/documents/'+doc.id, target: "_blank", html: doc.title })
            ]
          }),
        ];

        if (doc.intro) {
          elems.push($$('.intro', {
            html: doc.intro
          }));
        }

        if (filtersEl.childNodes.length > 0) {
          elems.push(filtersEl);  
        }

        var documentEl = $$('.document', {
          "data-id": doc.id,
          children: elems
        });


        // Render preview
        // -----------


        if (doc.fragments) {
          var previewEl = new PreviewView({
            document: doc,
            fragments: doc.fragments,
            searchStr: searchStr
          });

          // Highlight previewed document in result list
          documentEl.appendChild(previewEl.render().el);
        }
        // Add detail view
        documentEl.appendChild($$('a.toggle-details', {
          "data-id": doc.id,
          href: "#",
          html: '<i class="fa fa-eye"></i> Show more'
        }));

        this.documentsEl.appendChild(documentEl);
      }, this);

    } else {
      // Render no search result
      this.documentsEl.appendChild($$('.no-result', {text: "Your search did not match any documents"}));
    }

    this.renderFacets();
    this.searchbarView.renderFilters();
  };

  this.toggleDetails = function(e) {
    console.log('TOGGLING', e.currentTarget);
    e.preventDefault();

    if ($(this.modalEl).hasClass('hidden')) {
      this.renderDetails();
      $(this.modalEl).removeClass('hidden');
    } else {
      $(this.modalEl).addClass('hidden');
    }
  };

  this.render = function() {
    this.el.innerHTML = "";
    this.el.appendChild(this.searchbarView.render().el);
    this.el.appendChild(this.panelWrapperEl);
    this.el.appendChild(this.progressbarEl);
    this.el.appendChild(this.modalEl);

    return this;
  };

  this.dispose = function() {
    this.stopListening();
    if (this.mainView) this.mainView.dispose();
  };
};

// Export
// --------

BrowserView.Prototype.prototype = View.prototype;
BrowserView.prototype = new BrowserView.Prototype();

module.exports = BrowserView;
