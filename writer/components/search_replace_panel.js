'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");
var Icon = require("substance-ui/font_awesome_icon");


class SearchReplacePanel extends Panel {

  // Initialization
  // -----------------

  constructor(props) {
    super(props);
  }

  handleSave(e) {
    e.preventDefault();

    // var htmlEditor = this.refs.htmlEditor;
    // var doc = this.getDocument();
    // doc.transaction(function(tx) {
    //   tx.set([this.state.comment.id, "content"], htmlEditor.getContent());
    // }.bind(this));

    // // Go back to show dialog
    // this.handleCancel(e);
  }

  render() {
  
    return $$('div', {className: 'search-replace-panel-component'},
      $$('div', {className: 'header toolbar clearfix menubar fill-light'},
        $$('div', {className: 'title float-left large'}, "Search and Replace"),
        $$('button', {className: 'button close-modal float-right'}, $$(Icon, {icon: 'fa-close'}))
      ),

      $$('div', {className: 'content'},
        "SEARCH AND REPLACE PANEL"
      )
    );
  }
}


SearchReplacePanel.displayName = 'SearchReplacePanel';
SearchReplacePanel.contextTypes = {
  app: React.PropTypes.object.isRequired
};

// Panel Configuration
// -----------------

SearchReplacePanel.icon = 'fa-comment';
SearchReplacePanel.isDialog = true;

module.exports = SearchReplacePanel;