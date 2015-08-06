var _ = require("underscore");

// Search Result
// =============================
// 
// An model abstraction for the search result that the controller can operate on


var SearchResult = function(data) {
  this.rawResult = data.result;
  this.searchQuery = data.searchQuery;
};

SearchResult.Prototype = function() {

  this.getSearchMetrics = function() {
    return {
      hits: this.rawResult.count
    };
  };

  // Set of documents according to search result and set filters
  // ------------

  this.getDocuments = function() {
    return this.rawResult.interviews;
  };


  this.getFacetCounts = function(facet) {
    return this.rawResult.facets[facet];
  };

  this.getFacets = function() {
    return this.rawResult.facets;
  };

  // Returns true when a given facet value is set as a filter
  // ------------

  this.isSelected = function(facetName, value) {
    var filter = this.searchQuery.filters[facetName];
    if (!filter) return false;
    return filter.indexOf(value) >= 0;
  };

  this.getNameForFilterValue = function(id) {
    // Try to find in subjects
    var obj = this.subjects.get(id);
    if (obj) return obj.name;
  };

};

SearchResult.prototype = new SearchResult.Prototype();

module.exports = SearchResult;
