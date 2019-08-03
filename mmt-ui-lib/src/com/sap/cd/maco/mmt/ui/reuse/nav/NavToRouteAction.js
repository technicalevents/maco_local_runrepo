/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/nav/RouteArgsFactory',
    'com/sap/cd/maco/mmt/ui/reuse/_/UI5MetadataTool'
  ],
  function(BaseAction, bundle, RouteArgsFactory, UI5MetadataTool) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.nav.NavToRouteAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.apply(this, arguments);
        this._oRouteArgsFactory = new RouteArgsFactory(this.oComponent);
        this._oUI5MetadataTool = new UI5MetadataTool();
      },

      execute: function(oParams, oEvent, oController) {
        // check oParams
        this.assertContextParam(oParams);

        return new Promise(
          function(resolve, reject) {
            // keep stuff
            this._oController = oController;
            this._oParams = oParams;
            this._oContext = oParams.contexts[0];
            this._fnResolve = resolve;
            this._fnReject = reject;

            // do we need to check data loss?
            var bConfirmDataLoss =
              this._oUI5MetadataTool.isSubclass(oController, 'com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageNoDraftController') &&
              (oController.getMode() === 'Create' || oController.getMode() === 'Update') &&
              this.oModel.hasPendingChanges();

            if (bConfirmDataLoss) {
              this.oMessage
                .confirm({
                  msg: bundle.get().getText('navConfirmDataLoss'),
                  buttonText: bundle.get().getText('navConfirmButton'),
                  warning: true
                })
                .then(this._nav.bind(this), function() {});
            } else {
              this._nav();
            }
          }.bind(this)
        );
      },

      _nav: function() {
        // map parameters
        var oObject = this._oContext.getObject();
        var oParams = {};
        for (var sKey in oObject) {
          var sMapped = this.oConfig.paramsMapping ? this.oConfig.paramsMapping[sKey] : null;
          if (sMapped) {
            oParams[sMapped] = oObject[sKey];
          } else {
            oParams[sKey] = oObject[sKey];
          }
        }

        // parameters from execute call
        // (overwrite the others)
        if (this._oParams.params) {
          for (var sParam in this._oParams.params) {
            oParams[sParam] = this._oParams.params[sParam];
          }
        }

        // compute route
        var sRoute = this._oController.oConfig.routes.child ? this._oController.oConfig.routes.child : this.oConfig.route;
        this.oAssert.ok(
          sRoute,
          'cannot execute create action. no route. configure the childRoute on the executing controller or the route on this action'
        );

        // compute args
        var oArgs = this._oRouteArgsFactory.fromObject(sRoute, oParams);

        // navigate
        this.oRouter.navTo(sRoute, oArgs);
      }
    });
  }
);
