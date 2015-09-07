'use strict';

var $$ = React.createElement;
var _ = require("substance/helpers");
var Panel = require("substance-ui/panel");

// Abstract class!

class EntitiesPanel extends Panel {

  // Event handlers
  // -----------------

  handleToggle(entityId, entityType) {
    var app = this.context.app;
    var filterByType = app.state.filterByType;

    if (app.state.entityId === entityId) {
      app.replaceState({
        contextId: "entities",
        filterByType: entityType
      });
    } else {
      app.replaceState({
        contextId: "entities",
        entityId: entityId,
        filterByType: filterByType,
        noResourceScroll: true
      });
    }
  }

  handleFilter(entityType) {
    var app = this.context.app;
    app.replaceState({
      contextId: "entities",
      filterByType: entityType
    });
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
    entities = _.sortBy(entities, function(entity) {
      // Trick for sorting by type and name
      var name = entity.title ? entity.title.toLowerCase() : entity.name.toLowerCase();
      return [entity.type, name].join("_");
    });
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
EntitiesPanel.icon = "fa-book";

module.exports = EntitiesPanel;