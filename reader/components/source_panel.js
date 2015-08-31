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
    return $$("div", {className: "panel source-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'source'},
          this._renderSource(metadata)
        ),
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

  _renderSource(metadata) {
    var type = metadata.record_type;
    var id = metadata.media_id;
    if(type == 'video') {
      var src = "https://player.vimeo.com/video/" + id + "?api=1";
      return $$('div', {className: 'video-source'},
        $$('iframe', {src: src, frameBorder: "0", mozallowfullscreen: "true", allowFullScreen: "true"})
      );
    } else if (type == 'audio') {
      return $$('ul',{className:"playlist"},
        $$('li',{},
          $$('a',{href: window.mediaServer + "/audio/"+id+".mp3"},"Test")
        )
      );
    } else {
      return $$('div',{}, "no source specified");
    }
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

  updateSourceTime(init) {
    var self = this;
    var app = this.context.app;
    var time = app.state.time;
    if(time) {
      var iframe = $('iframe')[0];
      var player = $f(iframe);
      if(init){
        player.addEvent('ready', function() {
          player.api('seekTo', self.hmsToSecondsOnly(time));
          player.api('pause');
        });
      } else {
        player.api('seekTo', this.hmsToSecondsOnly(time));
        player.api('play');
      }
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
    this.updateSourceTime(true);
  }

  componentDidUpdate() {
    this.updateSourceTime();
  }

}

SourcePanel.contextTypes = {
  app: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired
};

SourcePanel.displayName = i18n.t('panels.source');;
SourcePanel.contextId = "source";
SourcePanel.persistent = true;
SourcePanel.icon = "fa-youtube-play";

module.exports = SourcePanel;