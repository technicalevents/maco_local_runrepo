/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/nav/RouteArgs',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataMetaModelExt',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseAction, bundle, RouteArgs, ODataMetaModelExt, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.draft.SaveAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '0');
        this._oODataMetaModelExt = new ODataMetaModelExt(oComponent);
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams) {
        // check oParams
        this.assertContextParam(oParams);

        // keep stuff
        this._oParams = oParams;
        this._oContext = oParams.contexts[0];
        this._oObject = this._oContext.getObject();

        // default nav
        if (!oParams.hasOwnProperty('nav')) {
          oParams.nav = true;
        }

        // check controller
        Assert.subclass(
          oParams.controller,
          'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageDraftController',
          'action must be executed on a subclass of com.sap.cd.maco.mmt.ui.reuse.draft.ObjectPageDraftController'
        );

        return new Promise(
          function(resolve, reject) {
            this._fnResolve = resolve;
            this._fnReject = reject;

            this.oTransaction
              .whenDraftActivated({
                context: this._oContext,
                busyControl: this._oParams.busyControl
              })
              .then(this._onActivation.bind(this), this._fnReject);
          }.bind(this)
        );
      },

      _onActivation: function(oResult) {
        // show success message
        var sMsg = this.getConfigText('successMsg', 'transactionDraftActivateSuccess', [this._oObject]);
        this.oMessage.success({
          msg: sMsg
        });

        if (this._oParams.nav) {
          var oConConfig = this._oParams.controller.oConfig;
          if (this._oObject.HasActiveEntity) {
            // determine guid
            var sEntitySet = this.oConfig.entitySet ? this.oConfig.entitySet : oConConfig.entitySet;
            Assert.ok(
              sEntitySet,
              'cannot execute activate action. no entitySet. configure the entitySet on the action or on the executing controller'
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
            var sRoute = oConConfig.routes.this;
            Assert.ok(sRoute, 'cannot execute activate action. no route. configure the route on the executing controller');
            var oArgs = RouteArgs.fromObject(this.oComponent.getRouter(), sRoute, oActiveObject);

            // navigate to active object without creating a new history entry
            this.oRouter.navTo(sRoute, oArgs, true);
          } else {
            // navigate back (or to list report if history is empty)
            var sParentRoute = oConConfig.routes.parent;
            Assert.ok(sParentRoute, 'cannot execute cancel action. no parent route. configure the parent route on the executing controller');
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