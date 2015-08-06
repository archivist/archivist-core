'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var EntitiesPanel = require("./entities_panel");

class LocationsPanel extends EntitiesPanel {

  constructor(props) {
    super(props);
    this.entityType = "toponym";
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

LocationsPanel.displayName = 'Locations';
LocationsPanel.contextId = "locations";
LocationsPanel.icon = "fa-location-arrow";

module.exports = LocationsPanel;