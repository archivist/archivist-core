'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var EntitiesPanel = require("./entities_panel");

class PersonsPanel extends EntitiesPanel {

  constructor(props) {
    super(props);
    this.entityType = "person";
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

PersonsPanel.displayName = 'Persons';
PersonsPanel.contextId = "persons";
PersonsPanel.icon = "fa-user";

module.exports = PersonsPanel;