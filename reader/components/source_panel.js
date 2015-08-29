'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");


class SourcePanel extends Panel {

  // Create video element the first time, but reuse when already there
  getSourceElement() {
    // Use the cached sourceElement
    if (window.sourceEl) return window.sourceEl;

    var doc = this.props.doc;
    var metadata = doc.getDocumentMeta();
    var type = metadata.record_type;
    var id = metadata.media_id;
    var sourceEl;

    if(type == 'video') {
      var src = "https://player.vimeo.com/video/" + id + "?api=1&player_id=video_player";
      sourceEl = $('<div>').addClass('video-source').append(
        $('<iframe>').attr({id: 'video_player', src: src, frameborder: "0", webkitallowfullscreen: "true", mozallowfullscreen: "true", allowfullscreen: "true"})
      );
    } else if (type == 'audio') {
      sourceEl = $('<div>').addClass('audio-container');
    } else {
      sourceEl = $('<div>').addClass('no-source').append('No source specified');
    }

    window.sourceEl = sourceEl;
    return sourceEl;
  }

  // _renderSource(metadata) {
  //   var type = metadata.record_type;
  //   var id = metadata.media_id;
  //   if(type == 'video') {
  //     var src = "https://player.vimeo.com/video/" + id + "?api=1&player_id=video_player";
  //     return $$('div', {className: 'video-source'},
  //       $$('iframe', {id: 'video_player', src: src, frameborder: "0", webkitallowfullscreen: "true", mozallowfullscreen: "true", allowfullscreen: "true"})
  //     );
  //   } else if (type == 'audio') {
  //     return $$('div',{}, "audio-conteiner");
  //   } else {
  //     return $$('div',{}, "no source specified");
  //   }
  // }

  // Event handlers
  // -----------------

  handleClick(e) {
    e.preventDefault();
    // var commentId = e.currentTarget.dataset.id;

    // this.context.app.replaceState({
    //   contextId: "show-comment",
    //   commentId: commentId
    // });
  }

  render() {
    var app = this.context.app;
    var state = app.state;
    var doc = this.props.doc;
    var metadata = doc.getDocumentMeta();

    return $$("div", {className: "panel source-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'source', ref: 'sourceElWrapper'}),
        $$('div', {className: 'technical-info'},
          this._renderLabelValue(metadata, "project_name", i18n.t('metadata.project_name')),
          this._renderLabelValue(metadata, "conductor", i18n.t('metadata.conductor')),
          this._renderLabelValue(metadata, "operator", i18n.t('metadata.operator')),
          this._renderLabelValue(metadata, "sound_operator", i18n.t('metadata.sound_operator')),
          this._renderLabelValue(metadata, "interview_location", i18n.t('metadata.interview_location')),
          this._renderLabelValue(metadata, "interview_date", i18n.t('metadata.interview_date'))
        )
      )
    );
  }

  _renderLabelValue(metadata, prop, label) {
    var value = metadata[prop];
    if(!value) {
      return;
    }
    return $$('div', {className: 'container ' + prop},
      $$('div', {className: 'label'}, label),
      $$('div', {className: 'value'}, value)
    );
  }

  updateSource() {
    var sourceElWrapper = this.refs.sourceElWrapper.getDOMNode();
    var sourceEl = this.getSourceElement();

    $(sourceElWrapper).append(sourceEl);
    this.updateSourceTime();
  }

  updateSourceTime() {
    var app = this.context.app;
    var time = app.state.time;
    if(time) {
      var iframe = $('#video_player')[0];
      var player = $f(iframe);
      player.api('seekTo', this.hmsToSecondsOnly(time));
    }
  }

  hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;
    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
    return s;
  }

  componentDidMount() {
    this.updateSource();
    // this.updateSourceTime();
  }

  componentDidUpdate() {
    this.updateSource();
    // this.updateSourceTime();
  }

}

SourcePanel.contextTypes = {
  app: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired
};

SourcePanel.displayName = i18n.t('panels.source');
SourcePanel.contextId = "source";
SourcePanel.icon = "fa-youtube-play";

module.exports = SourcePanel;