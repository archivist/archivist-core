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
      return this._renderAudioSource();
    } else {
      return $$('div',{}, "no source specified");
    }
  }

  _renderAudioSource() {
    return $$('div', {className: 'audio-player'},
      $$('div', {id: "jquery_jplayer_1", className: "jp-jplayer"}),
      $$('div', {id: "jp_container_1", className: "jp-audio", role: "application", "aria-label": "media player"},
        $$('div', {className: "jp-type-single"},
          $$('div', {className: "jp-gui jp-interface"},
            $$('div', {className: "jp-controls"},
              $$('button', {className: "jp-play", role: "button", tabindex: "0"}, "play"),
              $$('button', {className: "jp-stop", role: "button", tabindex: "0"}, "play")
            ),
            $$('div', {className: "jp-progress"},
              $$('div', {className: "jp-seek-bar"},
                $$('div', {className: "jp-play-bar"})
              )
            ),
            $$('div', {className: "jp-volume-controls"},
              $$('button', {className: "jp-mute", role: "button", tabindex: "0"}, "mute"),
              $$('button', {className: "jp-volume-max", role: "button", tabindex: "0"}, "max volume"),
              $$('div', {className: "jp-volume-bar"},
                $$('div', {className: "jp-volume-bar-value"})
              )
            ),
            $$('div', {className: "jp-time-holder"},
              $$('div', {className: "jp-current-time", role: "timer", "aria-label": "time"}, " "),
              $$('div', {className: "jp-duration", role: "timer", "aria-label": "duration"}, " ")
            )
          ),
          $$('div', {className: "jp-no-solution"},
            $$('span', {}, "Update Required"),
            $$('p', {}, 'To play the media you will need to either update your browser to a recent version or update your Flash plugin')
          )
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

  updateSourceTime(init) {
    var self = this;
    var app = this.context.app;
    var doc = this.props.doc;
    var metadata = doc.getDocumentMeta();
    var id = metadata.media_id;
    var player = metadata.record_type;
    var time = app.state.time;

    if(init) {
      if(player == 'video') {
        this.initVideoPlayer(time);
      } else if (player == 'audio') {
        this.initAudioPlayer(time, id);
      }
    } else if (time) {
      if(player == 'video') {
        var iframe = $('iframe')[0];
        var player = $f(iframe);
        player.api('seekTo', this.hmsToSecondsOnly(time));
        player.api('play');
      } else if (player == 'audio') {
        var player = $("#jquery_jplayer_1");
        player.jPlayer("play", this.hmsToSecondsOnly(time));
      }
    }

  }

  initVideoPlayer(time) {
    var iframe = $('iframe')[0];
    var player = $f(iframe);
    var seekTo = time || 0;
    if(seekTo != 0) seekTo = this.hmsToSecondsOnly(seekTo); 
    player.addEvent('ready', function() {
      player.api('seekTo', seekTo);
      player.api('pause');
    });
  }

  initAudioPlayer(time, id) {
    var seekTo = time || 0; 
    if(seekTo != 0) seekTo = this.hmsToSecondsOnly(seekTo); 
    $("#jquery_jplayer_1").jPlayer({
      ready: function (event) {
        $(this).jPlayer("setMedia", {
          mp3: window.mediaServer + "/audio/" + id + ".mp3",
          oga: window.mediaServer + "/audio/" + id + ".ogg"
        });
        $(this).jPlayer("pause", seekTo);
      },
      supplied: "oga, mp3",
      wmode: "window",
      useStateClassSkin: true,
      autoBlur: false,
      smoothPlayBar: true,
      keyEnabled: true,
      remainingDuration: true,
      toggleDuration: true
    });
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