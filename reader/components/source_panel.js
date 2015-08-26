'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");
// Abstract class!

class SourcePanel extends Panel {

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
    return $$("div", {className: "panel sorce-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'source'},
          this._renderSource(metadata)
        )
        //$$('div', {className: 'biography', ref: 'biography'})
      )
    );
  }

  _renderSource(metadata) {
    var type = metadata.record_type;
    var id = metadata.media_id;
    if(type == 'video') {
      var src = "https://player.vimeo.com/video/" + id + "?api=1&player_id=video_player";
      var width = "630";
      var height = "354";
      return $$('iframe', {id: 'video_player', src: src, width: width, height: height, frameborder: "0", webkitallowfullscreen: "true", mozallowfullscreen: "true", allowfullscreen: "true"});
    } else if (type == 'audio') {
      return $$('div',{}, "audio-conteiner");
    } else {
      return $$('div',{}, "no source specified");
    }
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
    this.updateSourceTime();
  }

  componentDidUpdate() {
    this.updateSourceTime();
  }

}

SourcePanel.contextTypes = {
  app: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired
};

SourcePanel.displayName = 'Source';
SourcePanel.contextId = "source";
SourcePanel.icon = "fa-youtube-play";

module.exports = SourcePanel;