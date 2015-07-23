'use strict';

var _ = require("substance/helpers");

class Brackets {

  constructor(props) {
    this.props = props;

    this.$el = $('<div>');
    this.$el.addClass('brackets subject-references');

    this.$el.on('click', '.subject-reference', this.onToggleSubjectReference.bind(this));
  }

  // Event Handlers
  // -----------

  // componentDidMount() {

  //   this.props.doc.connect(this, {
  //     'document:changed': this.onDocumentChanged
  //   });
  //   // start listening to document changes
  // }

  onToggleSubjectReference(e) {
    console.log('TODO: handle toggling', e);
    e.preventDefault();
  }

  onDocumentChanged(change) {
    // Rerender
    this.render();
  }

  // Event Handlers
  // -----------

  updateBrackets() {
    var doc = this.props.doc;
    var subjectReferences = doc.getIndex('type').get('subject_reference');

    var brackets = {};

    // 3 available slots (0 means not used)
    var bracketSlots = [0,0,0];

    // Collects all events for the sweep algorithm
    var events = [];

    _.each(subjectReferences, function(subjRef) {
      var anchors = $(this.props.contentContainerEl).find('.anchor[data-id='+subjRef.id+']');

      var startAnchorEl, endAnchorEl;
      if ($(anchors[0]).hasClass('start-anchor')) {
        startAnchorEl = anchors[0];
        endAnchorEl = anchors[1];
      } else {
        startAnchorEl = anchors[1];
        endAnchorEl = anchors[0];
      }

      if (!startAnchorEl || !endAnchorEl) {
        console.warn("FIXME: Could not find anchors for subject reference ", subjRef.id);
        return;
      }

      var startTop = $(startAnchorEl).position().top;
      console.log('startTop', startTop);
      var endTop = $(endAnchorEl).position().top + $(endAnchorEl).height();
      var height = endTop - startTop;

      // Add start and end events
      events.push({
        subjRefId: subjRef.id,
        pos: startTop,
        type: "start"
      });

      events.push({
        subjRefId: subjRef.id,
        pos: endTop,
        type: "end"
      });

      brackets[subjRef.id] = {
        top: startTop,
        height: height,
        slot: null        
      };
    }, this);


    function bookSlot(subjRefId) {
      // debugger;
      // Use slot 0 by default
      var minVal = Math.min.apply(null, bracketSlots);
      var slot;

      for (var i = 0; i < bracketSlots.length && slot === undefined; i++) {
        var slotVal = bracketSlots[i];
        // Found first suitable slot
        if (slotVal === minVal) {
          slot = i;
          bracketSlots[i] = slotVal+1;
        }
      }
      // Assign slot to associated bracket
      brackets[subjRefId].slot = slot;
    }

    function releaseSlot(subjRefId) {
      var bracket = brackets[subjRefId];
      bracketSlots[bracket.slot] = bracketSlots[bracket.slot] - 1;
    }
    
    // Sort brackets and events
    events = _.sortBy(events, 'pos');

    // Start the sweep (go through all events)
    _.each(events, function(evt) {
      if (evt.type === "start") {
        bookSlot(evt.subjRefId);
      } else {
        releaseSlot(evt.subjRefId);
      }
    });

    // Render brackets
    // --------------

    _.each(brackets, function(bracket, bracketId) {
      var subjectRefEl = this.$el.find('[data-id='+bracketId+']');
      subjectRefEl.css({
        top: bracket.top,
        height: bracket.height
      });

      subjectRefEl.removeClass('level-0 level-1 level-2');
      subjectRefEl.addClass('level-'+bracket.slot);
    }, this);
  }

  render() {
    var doc = this.props.doc;

    var subjectReferences = doc.getIndex('type').get('subject_reference');
    var subjectRefComponents = [];

    // Clear content first, so the rerender works properly
    this.$el.empty();
    
    _.each(subjectReferences, function(sref) {
      var $bracketEl = $('<a>').attr({
        'href': '#',
        'data-id': sref.id,
      });

      $bracketEl.addClass('subject-reference');
      if (sref.active) $bracketEl.addClass('active');
      this.$el.append($bracketEl);
    }, this);

    this.updateBrackets();

    return this;
  }
}

module.exports = Brackets;
