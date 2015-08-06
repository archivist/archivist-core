"use strict";

var _ = require("substance/helpers");
var Controller = require("substance-application").Controller;
var BrowserView = require("./browser_view");
var SearchQuery = require("./search_query");
var SearchResult = require("./search_result");

var AVAILABLE_FACETS = require("./available_facets");
var AVAILABLE_KEYWORDS = require("./available_keywords");

// Used to initialize the SearchQuery model
var EMPTY_QUERY = {
  searchStr: "",
  filters: {}
};

// BrowserController
// =============================

var BrowserController = function(app, config) {
  Controller.call(this, app);
  this.config = config;

  this.searchQuery = new SearchQuery(EMPTY_QUERY);
  this.createView();

  this.searchQuery.on('query:changed', _.bind(this.startSearch, this));
};

BrowserController.Prototype = function() {

  this.initialize = function(newState, cb) {
    cb(null);
  };

  this.DEFAULT_STATE = {
    id: "main"
  };

  // Initiate a new search by making a state change
  // ------------------

  this.startSearch = function() {
    // console.log('query changed', this.searchQuery);

    this.switchState({
      id: "main",
      searchQuery: this.searchQuery.toJSON()
    });
  };

  this.getSuggestions = function(searchStr) {
    var suggestions = [];
    _.each(AVAILABLE_KEYWORDS, function(keyword) {
      if (keyword.toLowerCase().match(searchStr.toLowerCase())) {
        suggestions.push({
          value: keyword.replace(searchStr, "<b>"+searchStr+"</b>"),
          rawValue: keyword
        });
      }
    });

    return suggestions;
  };

  this.createView = function() {
    if (!this.view) {
      this.view = new BrowserView(this);
    }
    return this.view;
  };

  this.transition = function(newState, cb) {
    // console.log("BrowserController.transition(%s -> %s)", this.state.id, newState.id);

    // idem-potence
    // if (newState.id === this.state.id) {
    //   var skip = false;
    //   // TODO
    //   skip = true;
    //   if (skip) return cb(null, {skip: true});
    // }

    if (newState.id === "main") {

      if (this.state.id === "uninitialized") {
        // Set the initial search query from app state
        // TODO: this could be done in a onInitialize hook?
        // console.log('setting initial query', newState.searchQuery);

        var query;
        if (newState.searchQuery) {
          query = JSON.parse(JSON.stringify(newState.searchQuery));
        } else {
          query = EMPTY_QUERY;
          newState.searchQuery = JSON.parse(JSON.stringify(query));
        }
        this.searchQuery.setQuery(query);
      }
      if (!_.isEqual(newState.searchQuery, this.state.searchQuery)) {
        // Search query has changed
        this.loadSearchResult(newState, cb);
      } else {
        console.log('no state change detected, skipping', this.state, newState);
        return cb(null, {skip: true});
      }
    } else {
      console.log('state not explicitly handled', this.state, newState);
      return cb(null);
    }
  };

  // Search result gets loaded
  // -----------------------
  // 
  // TODO: error handling

  this.loadSearchResult = function(newState, cb) {
    this.view.showLoading();

    // Get filters from app state    
    var searchQuery = newState.searchQuery;

    // console.log(JSON.stringify(searchQuery));
    // var documentId = newState.documentId;
    var self = this;

    this.config.backend.findDocuments(searchQuery, function(err, result, subjects) {
      // console.log('search result:', result);
      // console.log(JSON.stringify(result.aggregations, null, "  "));

      self.config.backend.getSubjectsModel(function(err, subjects) {
        self.searchResult = new SearchResult({
          searchQuery: self.searchQuery,
          result: result
        }, {});

        console.log('searchresult', self.searchResult);

        // Add subjects model to the search result
        self.searchResult.subjects = subjects;
        self.previewData = null;
        cb(null);
      });
    });
  };

  this.afterTransition = function(oldState) {
    var newState = this.state;
    this.view.afterTransition(oldState, newState);
  };
};

BrowserController.Prototype.prototype = Controller.prototype;
BrowserController.prototype = new BrowserController.Prototype();
BrowserController.Controller = BrowserController;

module.exports = BrowserController;