sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata'], function(Object, UI5Metadata) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.action.ActionParams', {
    constructor: function() {},

    getParams: function(oController, oEvent) {
      var oControl = oEvent.getSource();
      var oParams = this._getParams(oControl);
      oParams.event = oEvent;
      oParams.controller = oController;
      return oParams;
    },

    _getParams: function(oControl) {
      var bFound = false;
      var iStep = 0;
      while (oControl && !bFound && iStep < 2000) {
        if (UI5Metadata.isSubclass(oControl, 'sap.ui.core.mvc.XMLView')) {
          // view
          return {
            busyControl: oControl,
            contexts: [oControl.getBindingContext()]
          };
        } else if (UI5Metadata.isSubclass(oControl, 'sap.m.ListItemBase')) {
          // table in place
          return {
            busyControl: oControl.getParent(),
            contexts: [oControl.getBindingContext()]
          };
        } else if (UI5Metadata.isSubclass(oControl, 'sap.ui.table.Row')) {
          return {
            busyControl: oControl.getParent(),
            contexts: [oControl.getBindingContext()]
          };
        } else if (UI5Metadata.isSubclass(oControl, 'sap.ui.comp.smarttable.SmartTable')) {
          // table toolbar
          return {
            busyControl: oControl,
            contexts: oControl.getTable().getSelectedContexts()
          };
        } else if (UI5Metadata.isSubclass(oControl, 'sap.m.ListBase')) {
          return {
            busyControl: oControl,
            contexts: oControl.getSelectedContexts()
          };
        } else if (UI5Metadata.isSubclass(oControl, 'sap.m.Dialog')) {
          // fragment
          return {
            busyControl: oControl,
            contexts: [oControl.getBindingContext()]
          };
        } else if (UI5Metadata.isSubclass(oControl, 'sap.m.Popover')) {
          return {
            busyControl: oControl,
            contexts: [oControl.getBindingContext()]
          };
        }

        // not found yet
        oControl = oControl.getParent();
        iStep++;
      }

      throw new Error('cannot determine action target control');
    }
  });
});
