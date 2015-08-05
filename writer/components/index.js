module.exports = {
  // Nodes
  "paragraph": require("substance-ui/paragraph_component"),
  "unsupported_node": require('../../shared/components/unsupported_node'),
  
  // Panels
  "subjects": require("../../shared/components/subjects_panel"),
  "entities": require("./entities_panel"),
  "tagentity": require("./tag_entity_panel"),
  "selectWaypoint": require("./select_location_panel"),
  "selectPrison": require("./select_location_panel"),
  "selectProjectLocation": require("./select_location_panel"),
  "showEntityReference": require("./show_entity_reference_panel"),
  "editSubjectReference": require("./edit_subject_reference_panel"),
  "comments": require("./comments_panel"),
  "show-comment": require("./show_comment_panel"),
  "edit-comment": require("./edit_comment_panel"),
  "metadata": require("./metadata_panel"),

  // Misc
  "content_toolbar": require("./content_toolbar"),
  "content_editor": require("./content_editor")
};

