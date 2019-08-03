/*global location*/
sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/_/bundle'], function(bundle) {
  'use strict';

  return function(oController, sKey, sName, bMandatory) {
    var sId = oController.oConfig.controls[sKey];
    if (!sId && !bMandatory) {
      return null;
    }
    var oControl = oController.byId(sId);
    oController.oAssert.ok(oControl, 'cannot find control ' + sKey + ' for id ' + sId);
    oController.oAssert.instance(oControl, sName, 'control with id ' + sId + ' must be an instance of ' + sName);
    return oControl;
  };
});
