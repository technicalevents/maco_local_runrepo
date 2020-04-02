/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/nav/RouteArgs',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataMetaModelExt',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getMessage',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getNav',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getTransaction'
  ],
  function(BaseAction, bundle, RouteArgs, ODataMetaModelExt, Assert, getMessage, getNav, getTransaction) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.draft.CancelAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
        this.oConfig.minContexts = 1;
        this.oConfig.maxContexts = 1;
        // default config
        if (!this.oConfig.hasOwnProperty('nav')) {
          this.oConfig.nav = true;
        }
        this._oODataMetaModelExt = new ODataMetaModelExt(oComponent);
      },

      execute: function(oParams) {
        // check oParams
        this.assertContextParam(oParams);

        // keep stuff
        this._oParams = oParams;
        this._oContext = oParams.contexts[0];
        this._oObject = this._oContext.getObject();

        // check controller
        Assert.subclass(
          oParams.controller,
          'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageDraftController',
          'cancel action must be executed on a subclass of com.sap.cd.maco.mmt.ui.reuse.draft.ObjectPageDraftController'
        );

        return new Promise(
          function(resolve, reject) {
            this._fnResolve = resolve;
            this._fnReject = reject;
            getMessage(this)
              .confirm({
                msg: bundle.getText('transactionDraftConfirmCancel'),
                buttonText: bundle.getText('buttonDiscard'),
                popover: true,
                byControl: oParams.event.getSource()
              })
              .then(this._onConfirmed.bind(this), reject);
          }.bind(this)
        );
      },

      _onConfirmed: function() {
        var oTransaction = getTransaction(this);
        oTransaction
          .whenDraftDeleted({
            context: this._oContext,
            busyControl: this._oParams.busyControl
          })
          .then(this._onDeleted.bind(this), this._fnReject);
      },

      _onDeleted: function(oResult) {
        if (this.oConfig.nav) {
          var oConConfig = this._oParams.controller.oConfig;
          if (this._oObject.HasActiveEntity) {
            // determine guid
            var sEntitySet = this.oConfig.entitySet ? this.oConfig.entitySet : oConConfig.entitySet;
            Assert.ok(sEntitySet, 'cannot execute cancel action. no entitySet. configure the entitySet on the action or on the executing controller');
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
            Assert.ok(sRoute, 'cannot execute cancel action. no route. configure the route on the executing controller');
            var oArgs = RouteArgs.fromObject(this.oComponent.getRouter(), sRoute, oActiveObject);

            // navigate to active object without creating a new history entry
            this.oRouter.navTo(sRoute, oArgs, true);
          } else {
            // navigate back (or to list report if history is empty)
            var sParentRoute = oConConfig.routes.parent;
            Assert.ok(sParentRoute, 'cannot execute cancel action. no parentRoute. configure the parent route on the executing controller');
            getNav(this).navHistoryBackAppTarget(sParentRoute, {}); // TODO empty route params
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
