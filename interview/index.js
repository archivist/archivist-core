var Interview = require("./interview");
var SubjectsModel = require("./subjects_model");
var EntitiesModel = require("./entities_model");

Interview.SubjectsModel = SubjectsModel;
Interview.EntitiesModel = EntitiesModel;

module.exports = Interview;