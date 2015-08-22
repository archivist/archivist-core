'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");

// Abstract class!

class EntitiesPanel extends Panel {

  // Event handlers
  // -----------------

  handleToggle(entityId) {
    var app = this.context.app;

    if (app.state.entityId === entityId) {
      app.replaceState({
        contextId: "entities"
      });
    } else {
      app.replaceState({
        contextId: "entities",
        entityId: entityId,
        noResourceScroll: true
      });
    }
  }

  componentDidMount() {
    this.updateScroll();
  }

  componentDidUpdate() {
    this.updateScroll();
  }

  updateScroll() {
    var app = this.context.app;
    if (app.state.entityId && !app.state.noResourceScroll) {
      this.scrollToNode(app.state.entityId);
    }
  }

  render() {
    var doc = this.props.doc;
    var app = this.context.app;
    var state = app.state;

    var entities = doc.entities.getEntities();
    var componentRegistry = this.context.componentRegistry;

    var entityEls = [];
    _.each(entities, function(entity) {
      entityEls.push($$(componentRegistry.get(entity.type), {
        entity: entity,
        active: state.entityId === entity.id,
        handleToggle: this.handleToggle.bind(this)
      }));
    }, this);

    return $$("div", {className: "panel entity-panel-component"},
      $$('div', {className: 'panel-content', ref: "panelContent"},
        $$('div', {className: 'entities panel-content-inner'},
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

EntitiesPanel.displayName = 'Entities';
EntitiesPanel.contextId = "entities";
EntitiesPanel.icon = "fa-bullseye";

module.exports = EntitiesPanel;