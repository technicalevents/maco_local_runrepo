sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(Object, Assert) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.action.ActionResolution', {
    constructor: function() {},

    getAction: function(oController, sActionName) {
      var oResult;
      Assert.ok(oController.oConfig, 'cannot resolve action. missing a config on controller');
      if (oController.oConfig.actions) {
        // from controller
        oResult = oController.oConfig.actions[sActionName];
        Assert.ok(oController.oConfig.actions[sActionName], 'cannot resolve action. no action in controller config with name: ' + sActionName);
      } else if (oController.oConfig.object) {
        // from component
        var sObject = oController.oConfig.object;
        var oComp = oController.getOwnerComponent();
        Assert.ok(oComp.actions, 'cannot resolve action. no actions on component');
        Assert.ok(oComp.actions[sObject], 'cannot resolve action. no actions for object ' + sObject);
        Assert.ok(oComp.actions[sObject][sActionName], 'cannot resolve action. no action ' + sActionName + ' for object ' + sObject);
        oResult = oComp.actions[sObject][sActionName];
      } else {
        Assert.ok(false, 'cannot resolve action. no actions for controller');
      }
      return oResult;
    }
  });
});
