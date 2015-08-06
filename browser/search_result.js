var _ = require("underscore");

// Search Result
// =============================
// 
// An model abstraction for the search result that the controller can operate on

var AVAILABLE_FACETS = require("./available_facets");

var LABEL_MAPPING = {
  subjects: "Subjects",
  article_type: "Article Type",
  organisms: "Organisms",
  authors: "Top Authors"
};

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

  // this.getScopedFrequency = function(facet, value) {
  //   var facet = this.rawResult.aggregations[facet];
  //   if (!facet) return "0";
  //   var bucket = _.select(facet.buckets, function(bucket) {
  //     return bucket.key === value;
  //   });
  //   return bucket.length > 0 ? bucket[0].doc_count : "0";
  // };

  this.getScopedFrequency = function(facet, value) {
    return this.rawResult.facets[facet][value];
    // var facet = this.rawResult.aggregations[facet];

    // if (!facet) return "0";
    // var bucket = _.select(facet.buckets, function(bucket) {
    //   return bucket.key === value;
    // });
    // return bucket.length > 0 ? bucket[0].doc_count : "0";
  };

  // this.getFacets = function() {


  //   var facets = [];
  //   var self = this;
  //   var aggregations = this.rawResult.aggregations;

  //   if (!aggregations) return facets;
  //   // console.log(JSON.stringify(this.rawResult.aggregations, null, "  "));

  //   _.each(LABEL_MAPPING, function(label, property) {
  //     var entries = [];

  //     if (AVAILABLE_FACETS[property]) {
  //       _.each(AVAILABLE_FACETS[property].buckets, function(bucket) {
  //         entries.push({
  //           name: bucket.key,
  //           frequency: bucket.doc_count,
  //           scoped_frequency: self.getScopedFrequency(property, bucket.key),
  //           selected: self.isSelected(property, bucket.key)
  //         });
  //       });
  //     }

  //     facets.push({
  //       name: label,
  //       property: property,
  //       entries: entries
  //     });
  //   });

  //   return facets;
  // };

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
};

SearchResult.prototype = new SearchResult.Prototype();

module.exports = SearchResult;
