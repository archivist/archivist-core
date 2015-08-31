'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");
var Icon = require("substance-ui/font_awesome_icon");
var searchReplaceTransformation = require("../transformations/search_replace");


class SearchReplacePanel extends Panel {

  // Initialization
  // -----------------

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // push surface selection state so that we can recover it when closing
    this.context.surfaceManager.pushState();
  }

  componentWillUnmount() {
    this.context.surfaceManager.popState();
  }

  performAction(e) {
    e.preventDefault();

    var doc = this.getDocument();
    var searchStr = React.findDOMNode(this.refs.searchStr).value;
    var replaceStr = React.findDOMNode(this.refs.replaceStr).value;

    doc.transaction(function(tx) {
      searchReplaceTransformation(tx, {
        containerId: 'content',
        searchStr: searchStr,
        replaceStr: replaceStr
      });
    }.bind(this));

    var app = this.context.app;
    app.closeModal();
  }

  render() {
  
    return $$('div', {className: 'search-replace-panel-component'},
      $$('div', {className: 'header toolbar clearfix menubar fill-light'},
        $$('div', {className: 'title float-left large'}, "Search and Replace"),
        $$('button', {className: 'button close-modal float-right'}, $$(Icon, {icon: 'fa-close'}))
      ),

      $$('div', {className: 'content'},
        $$('div', {className: 'label'}, 'Find what'),
        $$('input', {type: 'text', ref: 'searchStr'}),
        $$('div', {className: 'label'}, 'Replace with'),
        $$('input', {type: 'text', ref: 'replaceStr'}),
        $$('button', {className: 'button action save-comment', onClick: this.performAction.bind(this)}, 'Replace All')
      )
    );
  }
}


SearchReplacePanel.displayName = 'SearchReplacePanel';
SearchReplacePanel.contextTypes = {
  app: React.PropTypes.object.isRequired,
  surfaceManager: React.PropTypes.object.isRequired
};

// Panel Configuration
// -----------------

SearchReplacePanel.icon = 'fa-comment';
SearchReplacePanel.isDialog = true;

SearchReplacePanel.modalSize = "medium";

module.exports = SearchReplacePanel;