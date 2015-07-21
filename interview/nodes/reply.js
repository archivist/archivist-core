var ContainerAnnotation = require("substance").Document.ContainerAnnotation;

var Reply = ContainerAnnotation.extend({
  name: "reply",
  properties: {
    "content": "string"
  }
});

module.exports = Reply;