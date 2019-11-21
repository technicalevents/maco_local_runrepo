/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/nav/RouteArgs',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseAction, bundle, RouteArgs, UI5Metadata, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.nav.NavToRouteAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '1');
      },

      execute: function(oParams) {
        // check oParams
        this.assertContextParam(oParams);

        return new Promise(
          function(resolve, reject) {
            // keep stuff
            this._oParams = oParams;
            this._oContext = oParams.contexts[0];
            this._fnResolve = resolve;
            this._fnReject = reject;

            // do we need to check data loss?
            var bConfirmDataLoss =
              UI5Metadata.isSubclass(oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageNoDraftController') &&
              (oParams.controller.getMode() === 'Create' || oParams.controller.getMode() === 'Update') &&
              this.oModel.hasPendingChanges();

            if (bConfirmDataLoss) {
              this.oMessage
                .confirm({
                  msg: bundle.getText('navConfirmDataLoss'),
                  buttonText: bundle.getText('navConfirmButton'),
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
        var oConConfig = this._oParams.controller.oConfig;
        var sRoute = oConConfig.routes && oConConfig.routes.child ? oConConfig.routes.child : this.oConfig.route;
        Assert.ok(sRoute, 'cannot execute NavToRouteAction. no child route. configure the child route on the action or the executing controller');

        // compute args
        var oArgs = RouteArgs.fromObject(this.oComponent.getRouter(), sRoute, oParams);

        // navigate
        this.oRouter.navTo(sRoute, oArgs);
      }
    });
  }
);
