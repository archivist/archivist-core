module.exports = {
  // Nodes
  "paragraph": require("substance-ui/paragraph_component"),
  "unsupported_node": require('../../shared/components/unsupported_node'),
  
  // Panels
  "subjects": require("../../shared/components/subjects_panel"),
  "prisons": require("./prisons_panel"),

  "prison": require("./prison"),

  // Misc
  // "content_toolbar": require("./content_toolbar"),
  "content_container": require("./content_container")
};
