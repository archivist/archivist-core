var _ = require('substance/helpers');

// HACK: remember previous selection so we can check if a selection has changed
var prevSelection;

var stateHandlers = {

  handleSelectionChange: function(app, sel, annotations) {
    var surface = app.getSurface();
    var contentContainer = surface.getContainer();
    var doc = app.doc;

    if (sel.isNull() || !sel.isPropertySelection() || !sel.isCollapsed()) return false;
    if (surface.getContainerName() !== "content") return false;

    if (sel.equals(prevSelection)) {
      return;
    }
    prevSelection = sel;

    // From entities panel
    // ---------------
    //

    var annotations = app.doc.annotationIndex.get(sel.getPath(), sel.getStartOffset(), sel.getEndOffset(), "entity_reference");

    if (annotations.length > 0) {
      var ref = annotations[0];
      app.replaceState({
        contextId: "showEntityReference",
        entityReferenceId: ref.id,
        noScroll: true
      });
      return true;
    }

    // Comments module
    // ---------------
    //

    var annos = doc.getContainerAnnotationsForSelection(sel, contentContainer, {
      type: "comment"
    });

    var activeComment = annos[0];
    if (activeComment) {
      app.replaceState({
        contextId: "show-comment",
        commentId: activeComment.id,
        noScroll: true
      });
      return true;
    }

    if (sel.isCollapsed() && app.state.contextId !== "editSubjectReference") {
      app.replaceState({
        contextId: 'metadata'
      });
      return true;
    }

  },

  handleStateChange: function(app, newState, oldState) {
    var doc = app.doc;

    function getActiveAnnotations(state) {

      if (!state) return [];
      // Subjects-specific
      // --------------------
      //
      // When a subject has been clicked in the subjects panel
      if (state.contextId === "editSubjectReference" && state.subjectReferenceId) {
        return [ doc.get(state.subjectReferenceId) ];
      }
      if (state.contextId === "subjects" && state.subjectId) {
        return _.map(doc.subjects.getReferencesForSubject(state.subjectId), function(id) {
          return doc.get(id);
        });
      }
      
      // Entities-specific
      // --------------------
      //
      // When a subject has been clicked in the subjects panel

      // Let the extension handle which nodes should be highlighted
      if (state.contextId === "entities" && state.entityId) {
        // Use reference handler
        return _.map(doc.entityReferencesIndex.get(state.entityId));
      } else if (state.entityReferenceId) {
        return [ doc.get(state.entityReferenceId) ];
      }

      return [];
    }
    var oldActiveAnnos = _.compact(getActiveAnnotations(oldState));
    var activeAnnos = getActiveAnnotations(newState);
    if (oldActiveAnnos.length || activeAnnos.length) {
      var tmp = _.without(oldActiveAnnos, activeAnnos);
      activeAnnos = _.without(activeAnnos, oldActiveAnnos);
      oldActiveAnnos = tmp;

      _.each(oldActiveAnnos, function(anno) {
        anno.setActive(false);
      });
      _.each(activeAnnos, function(anno) {
        anno.setActive(true);
      });
      return true;
    } else {
      return false;
    }
  },

  // Determine highlighted nodes
  // -----------------
  //
  // => inspects state
  //
  // TODO: this is potentially called too often
  //
  // Based on app state, determine which nodes should be highlighted in the content panel
  // @returns a list of nodes to be highlighted

  getHighlightedNodes: function(app) {
    var doc = app.doc;
    var state = app.state;

    // Subjects-specific
    // --------------------
    //
    // When a subject has been clicked in the subjects panel

    if (state.contextId === "editSubjectReference" && state.subjectReferenceId) {
      return [ state.subjectReferenceId ];
    }

    if (state.contextId === "subjects" && state.subjectId) {
      return doc.subjects.getReferencesForSubject(state.subjectId);
    }

    // Entities-specific
    // --------------------
    //
    // When a subject has been clicked in the subjects panel

    // Let the extension handle which nodes should be highlighted
    if (state.contextId === "entities" && state.entityId) {
      // Use reference handler
      var references = Object.keys(doc.entityReferencesIndex.get(state.entityId));
      
      var highlights = [];

      var container = doc.get('content');

      _.each(references, function(h) {
        var anno = doc.get(h);
        var pos = container.getPosition(anno.path[0]);
        highlights.push({highlight: h, pos: pos});
      });

      highlights = _.sortBy(highlights, "pos");

      return _.pluck(highlights, "highlight");
    } else if (state.entityReferenceId) {
      return [state.entityReferenceId];
    }

    // Comment-specific
    // --------------------
    //

    if (_.includes(["show-comment", "edit-comment"], state.contextId) && state.commentId) {
      return [state.commentId];
    }

  }
};



module.exports = stateHandlers;