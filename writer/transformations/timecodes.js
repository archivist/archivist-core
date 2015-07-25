var _ = require('substance/helpers');
var Substance = require('substance');
var Document = Substance.Document;

var timecodesMap = {};

function detectTimecodes(tx, path) {
  var text = tx.get(path);

  var matcher = new RegExp("\{(.+?)\}", "g");
  var matches = [];
  var match;

  while (match = matcher.exec(text)) {
    var alredyExists = checkForExistingTimecode(path, match.index);
    if(!alredyExists) {
      var timecode = {
        type: "timecode",
        startOffset: match.index,
        endOffset: matcher.lastIndex,
        path: path,
        id: 'timecode' + Substance.uuid()
      };

      matches.unshift(timecode);
    }
  }
  return matches;
}

var checkForExistingTimecode = function(path, startOffset) {
  // If there's no such node in existing timecodes map, then it's new timecode
  if(!timecodesMap[path[0]]) {
    return false;
  } else {
    // If there's node inside timecodes map, then we try to find timecode using startOffset
    var exists = false;
    var filtereredTimecodes = _.filter(timecodesMap[path[0]], function(tc){ return tc.startOffset == startOffset; });
    if(!_.isEmpty(filtereredTimecodes)) exists = true;
    return exists;
  }
}

function annotateTimecodes(tx, path) {
  var matches = detectTimecodes(tx, path);

  while(matches.length > 0) {
    _.each(matches, function(match) {
      tx.create(match);
      if(!timecodesMap[path[0]]) {
        timecodesMap[path[0]] = [];
      }
      timecodesMap[path[0]].push({
        startOffset: match.startOffset,
        endOffset: match.endOffset
      });
    });
    matches = detectTimecodes(tx, path);
  }
  
}

function timecodeAnnotator(tx, containerId) {
  if (!containerId) {
    throw new Error("Argument 'containerId' is mandatory.");
  }

  console.log('running timecode annotator...');

  var container = tx.get(containerId);

  var timecodes = tx.getIndex('type').get('timecode');
  _.each(timecodes, function(tc){
    if(!timecodesMap[tc.path[0]]) {
      timecodesMap[tc.path[0]] = [];
    }
    timecodesMap[tc.path[0]].push({
      startOffset: tc.startOffset,
      endOffset: tc.endOffset
    });
  })


  var components = container.getComponents();

  _.each(components, function(comp) {
    annotateTimecodes(tx, comp.path);
  });
}

module.exports = timecodeAnnotator;