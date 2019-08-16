/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/nav/RouteArgsFactory',
    'com/sap/cd/maco/mmt/ui/reuse/_/ODataMetaModelExt'
  ],
  function(BaseAction, bundle, RouteArgsFactory, ODataMetaModelExt) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.draft.CancelAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.apply(this, arguments);
        this._oRouteArgsFactory = new RouteArgsFactory(oComponent);
        this._oODataMetaModelExt = new ODataMetaModelExt(oComponent);
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams, oEvent, oController) {
        // check oParams
        this.assertContextParam(oParams);

        // keep stuff
        this._oController = oController;
        this._oParams = oParams;
        this._oContext = oParams.contexts[0];
        this._oObject = this._oContext.getObject();

        // default nav
        if (!oParams.hasOwnProperty('nav')) {
          oParams.nav = true;
        }

        // check controller
        this.oAssert.subclass(
          oController,
          'com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageDraftController',
          'cancel action must be executed on a subclass of com.sap.cd.maco.mmt.ui.reuse.draft.ObjectPageDraftController'
        );

        return new Promise(
          function(resolve, reject) {
            this._fnResolve = resolve;
            this._fnReject = reject;
            this.oMessage
              .confirm({
                msg: bundle.get().getText('transactionDraftConfirmCancel'),
                buttonText: bundle.get().getText('buttonDiscard'),
                popover: true,
                byControl: oEvent.getSource()
              })
              .then(this._onConfirmed.bind(this), reject);
          }.bind(this)
        );
      },

      _onConfirmed: function() {
        this.oTransaction
          .whenDraftDeleted({
            context: this._oContext,
            busyControl: this._oParams.busyControl
          })
          .then(this._onDeleted.bind(this), this._fnReject);
      },

      _onDeleted: function(oResult) {
        if (this._oParams.nav) {
          if (this._oObject.HasActiveEntity) {
            // determine guid
            var sEntitySet = this.oConfig.entitySet ? this.oConfig.entitySet : this._oController.oConfig.entitySet;
            this.oAssert.ok(
              sEntitySet,
              'cannot execute cancel action. no entitySet. configure the entitySet on the action or on the executing controller'
            );
            var sGuid = this._oODataMetaModelExt.getGuid(sEntitySet);

            // mimic active object
            var oActiveObject = {};
            jQuery.extend(oActiveObject, this._oObject);
            oActiveObject.IsActiveEntity = true;
            oActiveObject.HasActiveEntity = false;
            oActiveObject[sGuid] = this._oObject.ActiveUUID;
            oActiveObject.ActiveUUID = null;

            // compute route args
            var sRoute = this._oController.oConfig.routes.this;
            this.oAssert.ok(sRoute, 'cannot execute cancel action. no route. configure the route on the executing controller');
            var oArgs = this._oRouteArgsFactory.fromObject(sRoute, oActiveObject);

            // navigate to active object without creating a new history entry
            this.oRouter.navTo(sRoute, oArgs, true);
          } else {
            // navigate back (or to list report if history is empty)
            var sParentRoute = this._oController.oConfig.routes.parent;
            this.oAssert.ok(sParentRoute, 'cannot execute cancel action. no parentRoute. configure the parent route on the executing controller');
            this.oNav.navHistoryBackAppTarget(sParentRoute, {}); // TODO empty route params
          }
        }

        // resolve
        this._fnResolve({
          params: this._oParams,
          data: this._oObject
        });
      }
    });
  }
);