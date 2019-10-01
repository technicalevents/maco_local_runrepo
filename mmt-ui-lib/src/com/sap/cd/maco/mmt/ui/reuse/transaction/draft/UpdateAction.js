/*global location*/
sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/base/BaseAction', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle', 'com/sap/cd/maco/mmt/ui/reuse/nav/RouteArgsFactory'],
  function(BaseAction, bundle, RouteArgsFactory) {
    'use strict';

    // check for unsaved changes of other users?
    //  - FE is not doing this in 1.56 ... so i commented the coding
    //  - commented code below

    // check for locking draft of other users?
    //  - BOPF backend is raising a proper error message with status code 409 that will be shown by message manager
    //  - no check on the client required

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.draft.UpdateAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '1');
        // TODO check config
        this._oRouteArgsFactory = new RouteArgsFactory(oComponent);
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams, oEvent, oController) {
        // check params
        this.assertContextParam(oParams);
        var oContext = oParams.contexts[0];

        // default params
        if (!oParams.hasOwnProperty('nav')) {
          oParams.nav = true;
        }

        return new Promise(
          function(resolve, reject) {
            var oWhen = this.oTransaction.whenDraftEditCreated({
              context: oContext,
              busyControl: oParams.busyControl
            });
            oWhen.then(
              // resolve
              function(oResult, oError) {
                // navigate
                if (oParams.nav) {
                  // get route from controller config
                  this.oAssert.subclass(
                    oController,
                    'com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageDraftController',
                    'action must be executed on a subclass of com.sap.cd.maco.mmt.ui.reuse.draft.ObjectPageController'
                  );
                  var sRoute = oController.oConfig.routes.this;
                  // compute route args
                  var oArgs = this._oRouteArgsFactory.fromObject(sRoute, oResult.data);
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

        /*
           // ask the user if he wants to discard the unsaved changes
           var oAdminData = params.context.getObject('DraftAdministrativeData');
           if (oObject.HasDraftEntity && !oAdminData.InProcessByUser) {
           var sMsg = bundle.get().getText('draftMessageEditUnsavedChanges');
           this._oMessage
           .confirm({
           msg: sMsg,
           msgParams: oAdminData.LastChangedByUser,
           buttonText: bundle.get().getText('buttonEdit'),
           warning: true
           })
           .then(
           // resolve
           function() {
           return this._whenEditDraftReady(params);
           }.bind(this),
           // rejct
           reject
           );
           } else {
           return this._whenEditDraftReady(params);
           }
           draftMessageEditUnsavedChanges=User {0} edited this object without saving the changes. If you take over, those changes will be lost.
           */
      }
    });
  }
);
