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
    
    var abstract = exporter.convertProperty(doc, ['document', 'abstract']);
    var bio = exporter.convertProperty(doc, ['document', 'interviewee_bio']);

    return $$("div", {className: "panel info-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'abstract'},
          abstract
        ),
        $$('div', {className: 'biography'},
          bio
        )
      )
    );
  }
}

InfoPanel.contextTypes = {
  app: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired
};

InfoPanel.displayName = 'Info';
InfoPanel.contextId = "info";
InfoPanel.icon = "fa-info";

module.exports = InfoPanel;