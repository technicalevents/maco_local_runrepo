/*global location*/
sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/base/BaseAction', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle'], function(BaseAction, bundle) {
  'use strict';

  return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.nav.NavToExternalAction', {
    constructor: function(oComponent, oConfig) {
      BaseAction.call(this, oComponent, oConfig, '1');
    },

    execute: function(oParams) {
      return new Promise(
        function(resolve, reject) {
          // get object
          this.assertContextParam(oParams);
          var oObject = oParams.contexts[0].getObject();

          // compute params
          var oNavParams = {};
          for (var sToParam in this.oConfig.paramsMap) {
            var sFromParam = this.oConfig.paramsMap[sToParam];
            this.oAssert.ok(
              oObject.hasOwnProperty(sFromParam),
              'cannot execute NavToRouteAction. cannot map params. object has no property ' + sFromParam
            );
            oNavParams[sToParam] = oObject[sFromParam];
          }

          // navigate
          var oCrossAppNavigator = sap.ushell.Container.getService('CrossApplicationNavigation');
          oCrossAppNavigator.toExternal({
            target: {
              semanticObject: this.oConfig.semanticObject,
              action: this.oConfig.action
            },
            params: oNavParams
          });

          resolve();
        }.bind(this)
      );
    }
  });
});
