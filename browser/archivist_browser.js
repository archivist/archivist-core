"use strict";

var _ = require("substance/helpers");
var Application = require("substance-application");
var BrowserController = require("./browser_controller");
var DefaultRouter = require("substance-application").DefaultRouter;

var ArchivistBrowserApplication = function(config) {
  Application.call(this);
  this.controller = new BrowserController(this, config);
  var router = new DefaultRouter(this);
  this.setRouter(router);
};

ArchivistBrowserApplication.Prototype = function() {
  var __super__ = Application.prototype;

  this.start = function(options) {
    __super__.start.call(this, options);

    // Inject main view
    this.el.appendChild(this.controller.view.render().el);

    if (!window.location.hash) {
      this.switchState([{ id: "main" }], { updateRoute: true, replace: true });
    }
  };
};

ArchivistBrowserApplication.Prototype.prototype = Application.prototype;
ArchivistBrowserApplication.prototype = new ArchivistBrowserApplication.Prototype();

module.exports = ArchivistBrowserApplication;
