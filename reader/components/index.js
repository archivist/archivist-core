module.exports = {
  // Nodes
  "paragraph": require("substance-ui/paragraph_component"),
  "unsupported_node": require('../../shared/components/unsupported_node'),
  
  // Panels
  "subjects": require("../../shared/components/subjects_panel"),
  "prisons": require("./prisons/prisons_panel"),
  "locations": require("./locations/locations_panel"),

  "prison": require("./prisons/prison"),
  "toponym": require("./locations/location"),

  // Misc
  // "content_toolbar": require("./content_toolbar"),
  "content_container": require("./content_container")
};

