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

  handleFilter(type) {
    var app = this.context.app;
    if (app.state.filterByType === type) {
      app.replaceState({
        contextId: "entities"
      });
    } else {
      app.replaceState({
        contextId: "entities",
        filterByType: type
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
    var self = this;

    var doc = this.props.doc;
    var app = this.context.app;
    var state = app.state;

    var entities = doc.entities.getEntities();
    var componentRegistry = this.context.componentRegistry;

    var entityTypes = {
      "toponym": {
        icon: "fa-globe"
      },
      "prison": {
        icon: "fa-table"
      },
      "person": {
        icon: "fa-users"
      },
      "definition": {
        icon: "fa-book"
      }
    };

    var entityEls = [];
    var entityUsedTypes = _.uniq(_.pluck(entities, 'type'));
    if(state.filterByType) {
      entities = _.filter(entities, function(entity) {
        return entity.type === state.filterByType;
      });
    }
    _.each(entities, function(entity) {
      entityEls.push($$(componentRegistry.get(entity.type), {
        entity: entity,
        active: state.entityId === entity.id,
        handleToggle: this.handleToggle.bind(this)
      }));
    }, this);

    var entityFilters = [];
    _.each(entityUsedTypes, function(type){
      var classNames = ["entity-filter", "filter-" + type];
      if(type === state.filterByType) classNames.push('active');
      entityFilters.push($$('span', {
          className: classNames.join(" "),
          onClick: self.handleFilter.bind(self, type)
        },
        $$('i', {className: "fa " + entityTypes[type].icon}),
        i18n.t('entity.type.' + type)
      ));
    });

    return $$("div", {className: "panel entity-panel-component"},
      $$('div', {className: 'panel-content', ref: "panelContent"},
        $$('div', {className: "entity-filters"},
          entityFilters
        ),
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

EntitiesPanel.displayName = i18n.t('panels.entities');
EntitiesPanel.contextId = "entities";
EntitiesPanel.icon = "fa-comment-o";

module.exports = EntitiesPanel;