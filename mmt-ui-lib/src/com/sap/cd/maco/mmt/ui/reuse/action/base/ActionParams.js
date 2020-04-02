sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(
  Object,
  UI5Metadata,
  Assert
) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.action.base.ActionParams', {
    constructor: function() {},

    getParams: function(oController, oEvent) {
      var oParams = this._getParams(oEvent);
      oParams.event = oEvent;
      oParams.controller = oController;
      return oParams;
    },

    _getParams: function(oEvent) {
      var oControl = oEvent.getSource();
      var bControlIsList = UI5Metadata.isSubclass(oControl, 'sap.m.ListBase');
      if (bControlIsList) {
        return this._getParamsForList(oEvent);
      } else {
        return this._getParamsByParentChain(oEvent);
      }
    },

    _getParamsForList: function(oEvent) {
      var sEventId = oEvent.getId();
      var aHandledListEvents = ['delete', 'itemPress', 'swipe'];
      if (aHandledListEvents.indexOf(sEventId) !== -1) {
        var oItem = oEvent.getParameter('listItem');
        var oContext = oItem.getBindingContext();
        return {
          busyControl: oEvent.getSource(),
          contexts: [oContext]
        };
      } else {
        Assert.ok(false, 'cannot determine params. unhandled event for sap.m.ListBase: ' + sEventId);
      }
    },

    _getParamsByParentChain: function(oEvent) {
      var oControl = oEvent.getSource();
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
          // table in place
          return {
            busyControl: oControl.getParent(),
            contexts: [oControl.getBindingContext()]
          };
        } else if (UI5Metadata.isSubclass(oControl, 'sap.ui.comp.smarttable.SmartTable')) {
          // table toolbar
          return {
            busyControl: oControl,
            contexts: oControl.getTable().getSelectedContexts(),
            tableContext: oControl.getBindingContext()
          };
        } else if (UI5Metadata.isSubclass(oControl, 'sap.m.ListBase')) {
          // table toolbar
          return {
            busyControl: oControl,
            contexts: oControl.getSelectedContexts(),
            tableContext: oControl.getBindingContext()
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

      Assert.ok(false, 'cannot determine action target control');
    }
  });
});
