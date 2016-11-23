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
        $$('div', {className: 'biography', ref: 'biography'},
          $$('span', {className: 'section-title', id: 'biography'}, i18n.t('metadata.interviewee_bio'))
        )
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
    var doc = this.props.doc;
    var abstract_prop, bio_prop;
    var storage = window.storage || window.localStorage;
    var locale = storage.getItem('locale') || "ru";
    if(locale == "ru") {
      abstract_prop = "abstract";
      bio_prop = "interviewee_bio";
    } else if (locale == "en") {
      abstract_prop = "abstract_en";
      bio_prop = "interviewee_bio_en";
    } else if (locale == "de") {
      abstract_prop = "abstract_de";
      bio_prop = "interviewee_bio_de";
    }
    var $abstract = exporter.convertProperty(doc, ['document', abstract_prop]);
    var $bio = exporter.convertProperty(doc, ['document', bio_prop]);
    var splitted_abstract = $abstract.text().split('\n');
    var teaser_abstract = splitted_abstract.shift();
    var $teaser_abstract = $("<span/>", { class: "teaser" }).append(teaser_abstract);
    var complete_abstract = splitted_abstract.join('\n');
    var $complete_abstract = $$('div', { 
      className: "complete", 
      dangerouslySetInnerHTML: {
        __html: '<p>' + complete_abstract.split('\n').join('</p><p>') + '</p>' 
      } 
    });
    var $more = $("<span/>", { class: "more", text: i18n.t('metadata.show_more')});
    $more.click(function(){
      var $complete = $(this).siblings('.complete');
      var $teaser = $(this).siblings('.teaser');
      var isFullText = $complete.is(':visible');
      if(isFullText) {
        $complete.hide();
        $teaser.css('display', 'inline');
        $(this).text(i18n.t('metadata.show_more'));
      } else {
        $complete.show();
        $teaser.css('display', 'block');
        $(this).text(i18n.t('metadata.show_less'));
      } 
    });
    $(React.findDOMNode(this.refs.abstract)).empty().append($teaser_abstract, $complete_abstract, $more);
    $(React.findDOMNode(this.refs.biography)).append($bio);
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