"use strict";

var Substance = require('substance');
var Document = Substance.Document;

// Nodes
// --------------

var DocumentNode = require("./nodes/document_node");
var TextNode = require("./nodes/text_node");
var Emphasis = Document.Emphasis;
var Strong = Document.Strong;
var Remark = require("./nodes/remark");
var Comment = require("./nodes/comment");
var Reply = require("./nodes/reply");
var Timecode = require("./nodes/timecode");
var SubjectReference = require("./nodes/subject_reference");
var EntityReference = require("./nodes/entity_reference");
var Waypoint = require("./nodes/waypoint");

var schema = new Document.Schema("archivist-interview", "0.2.0");

schema.getDefaultTextType = function() {
  return "text";
};

schema.addNodes([
  DocumentNode,
  Emphasis,
  Strong,
  Remark, // Legacy
  Comment,
  Reply,
  Timecode,
  SubjectReference,
  EntityReference,
  Waypoint
]);

var Interview = function() {
  Interview.super.call(this, schema);
};

Interview.Prototype = function() {

  this.initialize = function() {
    this.super.initialize.apply(this, arguments);

    this.create({
      type: "container",
      id: "content",
      nodes: []
    });

    this.entityReferencesIndex = this.addIndex('entityReferencesIndex', Substance.Data.Index.create({
      type: "entity_reference",
      property: "target"
    }));

    // Legacy
    this.remarksIndex = this.addIndex('remarksIndex', Substance.Data.Index.create({
      type: "remark",
      property: "id"
    }));

    this.commentsIndex = this.addIndex('commentsIndex', Substance.Data.Index.create({
      type: "comment",
      property: "id"
    }));

    this.subjectReferencesIndex = this.addIndex('subjectReferencesIndex', Substance.Data.Index.create({
      type: "subject_reference",
      property: "target"
    }));
  };

  this.documentDidLoad = function() {
    Interview.super.prototype.documentDidLoad.call(this);
  };

  // TODO: implement!
  this.toXml = function() {
    // return new ArticleXmlExporter().convert(this);
  };

};


Substance.inherit(Interview, Document);

Interview.schema = schema;

Interview.fromJson = function(json) {
  var doc = new Interview();
  doc.loadSeed(json);
  return doc;
};

Interview.fromXml = function(xml) {
  // $root = $(xml);
  // var doc = new Interview();
  // new ArticleHtmlImporter().convert($root, doc);
  // doc.documentDidLoad();
  // return doc;
};


module.exports = Interview;