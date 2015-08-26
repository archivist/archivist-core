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
    var doc = this.props.doc;
    var metadata = doc.getDocumentMeta();
    return $$("div", {className: "panel sorce-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'source'},
          _renderSource(metadata)
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

  _renderContent() {
    
  }

  componentDidMount() {
    //this._renderContent();
  }

  componentDidUpdate() {
    //this._renderContent();
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