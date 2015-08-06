'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var EntitiesPanel = require("./entities_panel");

class DefinitionsPanel extends EntitiesPanel {

  constructor(props) {
    super(props);
    this.entityType = "definition";
  }

  // Event handlers
  // -----------------

  // handleClick(e) {
  //   e.preventDefault();
  //   var commentId = e.currentTarget.dataset.id;

  //   this.context.app.replaceState({
  //     contextId: "show-comment",
  //     commentId: commentId
  //   });
  // }

}

DefinitionsPanel.displayName = 'Definitions';
DefinitionsPanel.contextId = "definitions";
DefinitionsPanel.icon = "fa-comment";

module.exports = DefinitionsPanel;