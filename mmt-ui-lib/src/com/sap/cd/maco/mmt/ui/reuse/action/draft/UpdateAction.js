/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/nav/RouteArgs',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getTransaction'
  ],
  function(BaseAction, bundle, RouteArgs, Assert, getTransaction) {
    'use strict';

    // check for unsaved changes of other users?
    //  - FE is not doing this in 1.56 ... so i commented the coding
    //  - commented code below

    // check for locking draft of other users?
    //  - BOPF backend is raising a proper error message with status code 409 that will be shown by message manager
    //  - no check on the client required

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.draft.UpdateAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
        this.oConfig.minContexts = 1;
        this.oConfig.maxContexts = 1;
        // default config
        if (!this.oConfig.hasOwnProperty('nav')) {
          this.oConfig.nav = true;
        }
      },

      execute: function(oParams) {
        // check params
        this.assertContextParam(oParams);
        var oContext = oParams.contexts[0];

        return new Promise(
          function(resolve, reject) {
            var oTransaction = getTransaction(this);
            var oWhen = oTransaction.whenDraftEditCreated({
              context: oContext,
              busyControl: oParams.busyControl
            });
            oWhen.then(
              // resolve
              function(oResult, oError) {
                // navigate
                if (this.oConfig.nav) {
                  // get route from controller config
                  Assert.subclass(
                    oParams.controller,
                    'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageDraftController',
                    'action must be executed on a subclass of com.sap.cd.maco.mmt.ui.reuse.draft.ObjectPageController'
                  );
                  var sRoute = oParams.controller.oConfig.routes.this;
                  // compute route args
                  var oArgs = RouteArgs.fromObject(this.oComponent.getRouter(), sRoute, oResult.data);
                  // nav
                  this.oRouter.navTo(sRoute, oArgs, true);
                }

                resolve({
                  params: oParams,
                  context: oContext,
                  data: oResult.data
                });
              }.bind(this),
              reject
            );
          }.bind(this)
        );
      }
    });
  }
);
