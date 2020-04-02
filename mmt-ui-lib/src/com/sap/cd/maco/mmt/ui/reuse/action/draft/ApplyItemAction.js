/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getNav'
  ],
  function(BaseAction, Assert, getNav) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.draft.ApplyItemAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
      },

      execute: function(oParams) {
        return new Promise(
          function(resolve, reject) {
            // navigate back (or to list report if history is empty
            var oConConfig = oParams.controller.oConfig;
            var sParentRoute = oConConfig.routes.parent;
            Assert.ok(sParentRoute, 'cannot execute cancel action. no parent route. configure the parent route on the executing controller');
            getNav(this).navHistoryBackAppTarget(sParentRoute, {}); // TODO empty route params

            // resolve
            resolve({
              params: oParams
            });
          }.bind(this)
        );
      }
    });
  }
);
