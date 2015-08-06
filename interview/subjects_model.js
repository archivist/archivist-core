var Tree = require("./tree");
var Substance = require("substance");
var _ = require("substance/helpers");

var SubjectsModel = function(doc, subjects) {
  this.doc = doc;
  
  // Convert subjects to hash
  this.subjects = {};

  Substance.each(subjects, function(subject) {
    this.subjects[subject.id] = subject;
    if (doc) {
      var references = doc.subjectReferencesIndex.get(subject.id);
      this.subjects[subject.id].references = Substance._.pluck(references, 'id');      
    }
  }, this);
  
  this.tree = new Tree(this.subjects);
};

// Get tree representation suitable for jsTree widget
// ----------------

SubjectsModel.prototype.get = function(subjectId) {
  return this.subjects[subjectId];
};

// Get tree representation suitable for jsTree widget
// ----------------

SubjectsModel.prototype.getTree = function() {
  var tree = this.tree;

  function getChildren(parentId) {
    var res = [];
    var nodes = tree.getChildren(parentId);
    if (nodes.length === 0) return res; // exit condition

    Substance.each(nodes, function(node) {
      var entry = {
        id: node.id,
        text: node.name,
        children: getChildren(node.id) // get children for subj
      };
      res.push(entry);
    });
    return res;
  }

  return getChildren("root");
};


SubjectsModel.prototype.getAllReferencedSubjects = function() {
  var doc = this.doc;
  var subjectRefs = doc.subjectReferencesIndex.get();
  var subjects = [];

  Substance.each(subjectRefs, function(subjectRef) {
    Substance.each(subjectRef.target, function(subjectId) {
      var subject = this.tree.get(subjectId);
      if (!Substance.includes(subjects, subject)) {
        if(subject === undefined) {
          console.log('You have outdated subjects in this interview')
        } else {
          subjects.push(subject);
        }  
      }
    }, this);
  }, this);

  return subjects;
};


SubjectsModel.prototype.getTree = function() {
  return this.tree;
};

SubjectsModel.prototype.getReferencedSubjectsTree = function() {
  var referencedSubjects = this.getAllReferencedSubjectsWithParents();
  var filteredModel = new SubjectsModel(this.doc, referencedSubjects);
  return filteredModel.tree;
};

SubjectsModel.prototype.getFullPathForSubject = function(subjectId) {
  var tree = this.tree;
  var res = [];

  function getParent(nodeId) {
    var node = tree.get(nodeId);
    var parent = tree.getParent(nodeId);
    if (parent) getParent(parent.id);

    res.push(node.name);
    return res;
  }
  return getParent(subjectId);
};
  
// Used in state_handlers.js
SubjectsModel.prototype.getReferencesForSubject = function(subjectId) {
  var tree = this.getReferencedSubjectsTree();
  var relevantSubjects = tree.getAllChildren(subjectId).concat(subjectId);
  var doc = this.doc;
  var references = [];

  _.each(relevantSubjects, function(subjectId) {
    references = references.concat(Object.keys(doc.subjectReferencesIndex.get(subjectId)));
  });

  return _.uniq(references);
};

SubjectsModel.prototype.getAllReferencedSubjectsWithParents = function() {
  var referencedSubjects = this.getAllReferencedSubjects();
  var subjects = Substance.clone(referencedSubjects);
  var tree = this.tree;
  
  Substance.each(referencedSubjects, function(subject) {
    collectParents(subject.id);
  });

  function collectParents(nodeId) {
    var node = tree.get(nodeId);
    var parent = tree.getParent(nodeId);
    if (parent) collectParents(parent.id);

    subjects.push(node);
    return;
  }

  subjects = Substance.uniq(subjects);
  
  return subjects;
};

module.exports = SubjectsModel;