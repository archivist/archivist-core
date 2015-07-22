var Substance = require("substance");
var Document = Substance.Document;

// Note: in archivist paragraphs are called text nodes.
var TextNode = Document.TextNode.extend({
  name: "text"
});

// Html import
// -----------

TextNode.static.blockType = true;

TextNode.static.fromHtml = function($el, converter) {
  var id = converter.defaultId($el, 'p');
  var paragraph = {
    id: id,
    content: ''
  };
  paragraph.content = converter.annotatedText($el, [id, 'content']);
  return paragraph;
};

// HtmlExporter

TextNode.static.toHtml = function(paragraph, converter) {
  var id = paragraph.id;
  var $el = $('<p>')
    .attr('id', id);
  $el.append(converter.annotatedText([id, 'content']));
  return $el;
};



module.exports = TextNode;