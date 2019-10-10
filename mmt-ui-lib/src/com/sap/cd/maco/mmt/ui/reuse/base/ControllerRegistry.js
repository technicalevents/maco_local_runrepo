/* eslint no-console: "off"  */
sap.ui.define(['sap/ui/base/Object'], function(UI5Object) {
  'use strict';

  // TODO test

  // list report registered
  //this.oControllerRegistry.get('ListReport');
  //this.oControllerRegistry.getUnchecked('ListReport');
  //this.oControllerRegistry.getAll('ListReport');
  //this.oControllerRegistry.get('com.sap.cd.unexp.meteringproduct.view.listReport.ListReport');
  //this.oControllerRegistry.getUnchecked('com.sap.cd.unexp.meteringproduct.view.listReport.ListReport');
  //this.oControllerRegistry.getAll('com.sap.cd.unexp.meteringproduct.view.listReport.ListReport');

  // object page not registered
  //this.oControllerRegistry.get('ProductPage');
  //this.oControllerRegistry.getUnchecked('ProductPage');
  //this.oControllerRegistry.getAll('ProductPage');
  //this.oControllerRegistry.get('com.sap.cd.unexp.meteringproduct.view.productPage.ProductPage');
  //this.oControllerRegistry.getUnchecked('com.sap.cd.unexp.meteringproduct.view.productPage.ProductPage');
  //this.oControllerRegistry.getAll('com.sap.cd.unexp.meteringproduct.view.productPage.ProductPage');

  return UI5Object.extend('com.sap.cd.maco.mmt.ui.reuse.base.ControllerRegistry', {
    _mNameToControllers: null,
    _mClassToControllers: null,

    constructor: function(oAssert) {
      this._oAssert = oAssert;
      this._mNameToControllers = {};
      this._mClassToControllers = {};
    },

    register: function(oController) {
      // get names
      var oMetadata = oController.getMetadata();
      this._oAssert.ok(oMetadata, 'Failed to register controller. No metadata for ' + oController);
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
      this._oAssert.ok(aResult.length !== 0, 'Failed to get controller. Not registered yet: ' + sName);
      this._oAssert.ok(aResult.length === 1, 'Failed to get controller. Multiple registered: ' + sName);
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
