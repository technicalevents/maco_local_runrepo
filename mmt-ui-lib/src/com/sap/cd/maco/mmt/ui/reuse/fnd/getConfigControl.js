/*global location*/
sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/fnd/bundle', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(bundle, Assert) {
  'use strict';

  return function(oController, sKey, sName, bMandatory) {
    var sId = oController.oConfig.controls[sKey];
    if (!sId && !bMandatory) {
      return null;
    }
    var oControl = oController.byId(sId);
    Assert.ok(oControl, 'cannot find control ' + sKey + ' for id ' + sId);
    Assert.instance(oControl, sName, 'control with id ' + sId + ' must be an instance of ' + sName);
    return oControl;
  };
});
