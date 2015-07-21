var ParagraphComponent = require("substance-ui/paragraph_component");

module.exports = {
  "text": require('./text_component'), // legacy!
  "paragraph": ParagraphComponent,
  "include": require('./include_component'),
  "unsupported_node": require('./unsupported_node')
};
