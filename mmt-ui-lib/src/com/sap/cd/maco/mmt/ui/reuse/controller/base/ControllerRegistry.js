/* eslint no-console: "off"  */
sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(UI5Object, Assert) {
  'use strict';

  // samples:
  // oControllerRegistry.get('ListReport');
  // oControllerRegistry.get('com.sap.cd.unexp.meteringproduct.view.listReport.ListReport');
  // oControllerRegistry.getUnchecked('ListReport');
  // oControllerRegistry.getUnchecked('com.sap.cd.unexp.meteringproduct.view.listReport.ListReport');
  // oControllerRegistry.getAll('ListReport');
  // oControllerRegistry.getAll('com.sap.cd.unexp.meteringproduct.view.listReport.ListReport');

  return UI5Object.extend('com.sap.cd.maco.mmt.ui.reuse.controller.base.ControllerRegistry', {
    _mNameToControllers: null,
    _mClassToControllers: null,

    constructor: function() {
      this._mNameToControllers = {};
      this._mClassToControllers = {};
    },

    register: function(oController) {
      // get names
      var oMetadata = oController.getMetadata();
      Assert.ok(oMetadata, 'Failed to register controller. No metadata for ' + oController);
      var sClass = oMetadata.getName();
      var sName = sClass.indexOf('.') !== -1 ? sClass.substr(sClass.lastIndexOf('.') + 1, sClass.length) : sClass;

      // register by name
      if (!this._mNameToControllers[sName]) {
        this._mNameToControllers[sName] = [];
      }
      this._mNameToControllers[sName].push(oController);

      // register by class
      if (!this._mClassToControllers[sClass]) {
        this._mClassToControllers[sClass] = [];
      }
      this._mClassToControllers[sClass].push(oController);
    },

    get: function(sName) {
      var aResult = this.getAll(sName);
      Assert.ok(aResult.length !== 0, 'Failed to get controller. Not registered yet: ' + sName);
      Assert.ok(aResult.length === 1, 'Failed to get controller. Multiple registered: ' + sName);
      return aResult[0];
    },

    getUnchecked: function(sName) {
      var aResult = this.getAll(sName);
      return aResult.length === 0 ? null : aResult[0];
    },

    getAll: function(sName) {
      var bIsName = sName.indexOf('.') === -1;
      if (bIsName) {
        return this._getAllByName(sName);
      } else {
        return this._getAllByClass(sName);
      }
    },

    _getAllByName: function(sName) {
      if (this._mNameToControllers[sName]) {
        return this._mNameToControllers[sName];
      } else {
        return [];
      }
    },

    _getAllByClass: function(sClass) {
      if (this._mClassToControllers[sClass]) {
        return this._mClassToControllers[sClass];
      } else {
        return [];
      }
    }
  });
});
