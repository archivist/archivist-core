'use strict';

var _ = require("substance/helpers");

class Brackets {

  constructor(props) {
    this.props = props;
    this.$el = $('<div>');
    this.$el.addClass('brackets subject-references');

    this.$el.on('click', '.subject-reference', this.onToggleSubjectReference.bind(this));

    this.debouncedOnDocumentChanged = _.debounce(this.onDocumentChanged, 500).bind(this);
    this.props.doc.connect(this, {
      'document:changed': this.debouncedOnDocumentChanged
    });
  }

  // Event Handlers
  // -----------

  onToggleSubjectReference(e) {
    var subjectRefId = e.currentTarget.dataset.id;
    e.preventDefault();
    this.props.onBracketToggled(subjectRefId);
  }

  onDocumentChanged(change) {
    this.prevDate = Date.now();
    
    // Rerender
    this.render();
    this.updateBrackets();

    console.log('time for brackets updating', Date.now() - this.prevDate);
  }

  // Event Handlers
  // -----------

  updateBrackets() {
    var doc = this.props.doc;
    // var subjectReferences = doc.getIndex('type').get('subject_reference');

    var brackets = {};

    // 3 available slots (0 means not used)
    var bracketSlots = [0,0,0];

    var anchorEls = $(this.props.contentContainerEl).find('.anchor');

    var anchorPairs = {};
    _.each(anchorEls, function(anchorEl) {
      var subjRefId = anchorEl.dataset.id;
      if (!anchorPairs[subjRefId]) {
        anchorPairs[subjRefId] = {
          start: null,
          end: null,
          subjRefId: subjRefId
        };
      }
      if ($(anchorEl).hasClass('start-anchor')) {
        anchorPairs[subjRefId].start = anchorEl;
      } else {
        anchorPairs[subjRefId].end = anchorEl;
      }
    });


    // Collects all events for the sweep algorithm
    var events = [];

    _.each(anchorPairs, function(anchorPair) {
      var subjRefId = anchorPair.subjRefId;

      if (!anchorPair.start || !anchorPair.end) {
        console.warn("FIXME: Could not find anchors for subject reference ", subjRefId);
        return;
      }

      var startTop = $(anchorPair.start).position().top;
      var endTop = $(anchorPair.end).position().top + $(anchorPair.end).height();
      var height = endTop - startTop;

      // Add start and end events
      events.push({
        subjRefId: subjRefId,
        pos: startTop,
        type: "start"
      });

      events.push({
        subjRefId: subjRefId,
        pos: endTop,
        type: "end"
      });

      brackets[subjRefId] = {
        top: startTop,
        height: height,
        slot: null        
      };
    }, this);


    function bookSlot(subjRefId) {
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

  dispose() {
    this.props.doc.disconnect(this);
    this.$el.off('click', '.subject-reference', this.onToggleSubjectReference);
  }
}

module.exports = Brackets;
