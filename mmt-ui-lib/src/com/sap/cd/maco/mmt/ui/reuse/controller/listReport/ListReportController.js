sap.ui.define(
  [
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/controller/table/SmartTableController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(JSONModel, bundle, SmartTableController, Assert) {
    'use strict';

    return SmartTableController.extend('com.sap.cd.maco.mmt.ui.reuse.controller.listReport.ListReportController', {
      onInit: function(oConfig) {
        SmartTableController.prototype.onInit.apply(this, arguments);
        this._checkConfig();
        this._registerRoutes();
      },

      _checkConfig: function() {
        Assert.ok(this.oConfig, 'cannot init ListReport. config missing');
        Assert.ok(this.oConfig.controls, 'cannot init ListReport. controls config missing');
        if (this.oConfig.flpNavMenu) {
          Assert.ok(this.oConfig.flpNavMenu.title, 'cannot init ListReport. missing config: flpNavMenu.title');
          var oEntry = this.oComponent.getManifestEntry('sap.ui5');
          Assert.ok(
            !oEntry ||
              !oEntry.services ||
              !oEntry.services.ShellUIService ||
              !oEntry.services.ShellUIService.settings ||
              (oEntry.services.ShellUIService.settings.setHierarchy !== 'auto' && oEntry.services.ShellUIService.settings.setTitle !== 'auto'),
            'cannot init ListReport. flpNavMenu conflicts with the ShellUIService which is set to auto in manifest. Change this to manual'
          );
        }
      },

      _registerRoutes: function() {
        if (this.oConfig.flpNavMenu) {
          var oRoute = this.oRouter.getRoute(this.oConfig.routes.this);
          Assert.ok(oRoute, 'cannot init ListReport. the route ' + this.oConfig.routes.this + ' cannot be found. check your manifest');
          oRoute.attachPatternMatched(this._setFlpNavMenu, this);
        }
      },

      _setFlpNavMenu: function() {
        this.oComponent.getService('ShellUIService').then(
          function(oService) {
            var sTitle = this.oBundle.getText(this.oConfig.flpNavMenu.title);
            oService.setTitle(sTitle);
            oService.setHierarchy([]);
          }.bind(this),
          function(oError) {
            Assert.ok(false, 'Cannot set FLP nav menu. Cannot get ShellUIService.');
          }
        );
      },

      getVariantManagement: function() {
        return this.getConfigControl('variantManagement', 'sap.ui.comp.smartvariants.SmartVariantManagement', false);
      },

      getFilterBar: function() {
        return this.getConfigControl('filterBar', 'sap.ui.comp.smartfilterbar.SmartFilterBar', true);
      }
    });
  }
);
