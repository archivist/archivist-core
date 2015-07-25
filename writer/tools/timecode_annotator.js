var Substance = require('substance');
var Tool = Substance.Surface.Tool;
var timecodeAnnotator = require('../transformations/timecodes');

var timecodeAnnotatorTool = Tool.extend({
  name: "timecode_annotator",

  update: function(surface, sel) {
    this.surface = surface;

    var newState = {
      surface: surface,
      sel: sel,
      disabled: false
    };

    this.setToolState(newState);
  },

  performAction: function(app) {
    var doc = this.context.doc;
    var containerId = 'content';
    doc.transaction(function(tx) {
      timecodeAnnotator(tx, containerId);
    });
  }

});

module.exports = timecodeAnnotatorTool;