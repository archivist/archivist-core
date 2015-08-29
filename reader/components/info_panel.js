'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");
var Interview = require("../../interview");
var exporter = new Interview.HtmlExporter();
// Abstract class!

class InfoPanel extends Panel {

  // Event handlers
  // -----------------

  handleClick(e) {
    console.log('meh');

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
    var photo = this._renderPhoto(metadata);

    return $$("div", {className: "panel info-panel-component"},
      $$('div', {className: 'panel-content'},
        photo,
        $$('div', {className: 'abstract', ref: 'abstract'}),
        $$('div', {className: 'biography', ref: 'biography'})
      )
    );
  }

  _renderPhoto(metadata) {
    var filename = metadata.interviewee_photo;
    if(!filename) return '';
    var path = window.mediaServer + '/photos/' + filename;
    return $$('div', {className: 'photo'},
      $$('img', {src: path})
    );
  }

  _renderContent() {
    var $abstract = exporter.convertProperty(doc, ['document', 'abstract']);
    var $bio = exporter.convertProperty(doc, ['document', 'interviewee_bio']);
    $(React.findDOMNode(this.refs.abstract)).empty().append($abstract);
    $(React.findDOMNode(this.refs.biography)).empty().append($bio);
  }

  componentDidMount() {
    this._renderContent();
  }

  componentDidUpdate() {
    this._renderContent();
  }

}

InfoPanel.contextTypes = {
  app: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired
};

InfoPanel.displayName = i18n.t('panels.info');
InfoPanel.contextId = "info";
InfoPanel.icon = "fa-info-circle";

module.exports = InfoPanel;