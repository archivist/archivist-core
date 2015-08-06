'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");

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

    return $$("div", {className: "panel info-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'prisons entities'}
          // entityNodes
          
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