var Substance = require("substance");
var _ = require("substance/helpers");

var EntitiesModel = function(entities) {

  // Convert entities to hash
  this.entities = {};

  // And index them by type
  this.byType = {
    "person": [],
    "prison": [],
    "toponym": [],
    "definition": [],
  };

  _.each(entities, function(entity) {
    this.entities[entity.id] = entity;
    console.log('entity', entity);
    this.byType[entity.type].push(entity);
  }, this);

};

EntitiesModel.prototype.getEntity = function(entityId) {
  return this.entities[entityId];
};

EntitiesModel.prototype.findByType = function(entityType) {
  return this.byType[entityType];
};

module.exports = EntitiesModel;