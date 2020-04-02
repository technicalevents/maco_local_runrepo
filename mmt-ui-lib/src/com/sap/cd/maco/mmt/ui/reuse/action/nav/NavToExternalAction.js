/*global location*/
sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction', 'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'],
  function(BaseAction, bundle, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.nav.NavToExternalAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
        this.oConfig.minContexts = 1;
        this.oConfig.maxContexts = 1;
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
              Assert.ok(
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
  }
);
