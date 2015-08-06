'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");

// Abstract class!

class EntitiesPanel extends Panel {

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
    var entities = doc.entities.findByType(this.entityType);
    var componentRegistry = this.context.componentRegistry;

    var entityEls = [];
    _.each(entities, function(entity) {
      entityEls.push($$(componentRegistry.get(entity.type), {
        entity: entity,
        active: false, // TODO: calculate!
        onClick: this.handleClick.bind(this)
      }))
    }, this);


    return $$("div", {className: "panel prisons-panel-component"},
      $$('div', {className: 'panel-content'},
        $$('div', {className: 'prisons entities'},
          // entityNodes
          entityEls
        )
      )
    );
  }
}

EntitiesPanel.contextTypes = {
  app: React.PropTypes.object.isRequired,
  componentRegistry: React.PropTypes.object.isRequired
};

module.exports = EntitiesPanel;