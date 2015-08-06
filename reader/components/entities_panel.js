'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");

// Abstract class!

class EntitiesPanel extends Panel {

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

EntitiesPanel.contextTypes = {
  app: React.PropTypes.object.isRequired
};

module.exports = EntitiesPanel;