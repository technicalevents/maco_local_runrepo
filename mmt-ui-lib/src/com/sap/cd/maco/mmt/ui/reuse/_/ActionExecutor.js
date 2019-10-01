sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/_/UI5MetadataTool'], function(Object, UI5MetadataTool) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse._.ActionExecutor', {
    constructor: function(oController, oAssert) {
      this._oController = oController;
      this._oAssert = oAssert;
      this._oUI5MetadataTool = new UI5MetadataTool();
    },

    onAction: function(oEvent) {
      // input checks
      this._oAssert.ok(oEvent, 'cannot execute action. no event');
      var oSource = oEvent.getSource();
      var sActionName = oSource.data('action');
      this._oAssert.ok(sActionName, 'cannot execute action. missing custom data with key "action"');
      this._oAssert.ok(this._oController.oConfig, 'cannot execute action. missing a config on controller');
      this._oAssert.ok(this._oController.oConfig.actions, 'cannot execute action. no actions on controller config');
      this._oAssert.ok(this._oController.oConfig.actions[sActionName], 'cannot execute action. no action in config with name: ' + sActionName);

      // get action
      var oAction = this._oController.oConfig.actions[sActionName];

      // add standard params
      var oSource = oEvent.getSource();
      var oParams = this._getParams(oSource);

      // execute before
      var sBeforeFunc = 'onBeforeAction' + this._capitalize(sActionName);
      if (this._oController[sBeforeFunc]) {
        this._oController[sBeforeFunc](oParams, oEvent);
      }

      // execute
      oAction.execute(oParams, oEvent, this._oController).then(
        // resolve
        function(oResult) {
          // execute after
          var sAfterFunc = 'onAfterAction' + this._capitalize(sActionName);
          if (this._oController[sAfterFunc]) {
            this._oController[sAfterFunc](oResult, oParams);
          }
        }.bind(this),
        // reject
        function() {}
      );
    },

    _getParams: function(oControl) {
      var bFound = false;
      var iStep = 0;
      while (oControl && !bFound && iStep < 2000) {
        if (this._oUI5MetadataTool.isSubclass(oControl, 'sap.ui.core.mvc.XMLView')) {
          // view
          return {
            busyControl: oControl,
            contexts: [oControl.getBindingContext()]
          };
        } else if (this._oUI5MetadataTool.isSubclass(oControl, 'sap.m.ListItemBase')) {
          // table in place
          return {
            busyControl: oControl.getParent(),
            contexts: [oControl.getBindingContext()]
          };
        } else if (this._oUI5MetadataTool.isSubclass(oControl, 'sap.ui.table.Row')) {
          return {
            busyControl: oControl.getParent(),
            contexts: [oControl.getBindingContext()]
          };
        } else if (this._oUI5MetadataTool.isSubclass(oControl, 'sap.ui.comp.smarttable.SmartTable')) {
          // table toolbar
          return {
            busyControl: oControl,
            contexts: oControl.getTable().getSelectedContexts()
          };
        } else if (this._oUI5MetadataTool.isSubclass(oControl, 'sap.m.ListBase')) {
          return {
            busyControl: oControl,
            contexts: oControl.getSelectedContexts()
          };
        } else if (this._oUI5MetadataTool.isSubclass(oControl, 'sap.m.Dialog')) {
          // fragment
          return {
            busyControl: oControl,
            contexts: [oControl.getBindingContext()]
          };
        } else if (this._oUI5MetadataTool.isSubclass(oControl, 'sap.m.Popover')) {
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
    },

    _capitalize: function(sString) {
      return sString.charAt(0).toUpperCase() + sString.slice(1);
    }
  });
});
