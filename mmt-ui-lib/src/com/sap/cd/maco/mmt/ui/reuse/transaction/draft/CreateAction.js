/*global location*/
sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/base/BaseAction', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle', 'com/sap/cd/maco/mmt/ui/reuse/nav/RouteArgsFactory'],
  function(BaseAction, bundle, RouteArgsFactory) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.draft.CreateAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '0');
        this._oRouteArgsFactory = new RouteArgsFactory(oComponent);
      },

      enabled: function(aContexts) {
        return true;
      },

      execute: function(oParams, oEvent, oController) {
        // default params
        if (!oParams.hasOwnProperty('nav')) {
          oParams.nav = true;
        }

        return new Promise(
          function(resolve, reject) {
            // determine entity set
            var sEntitySet = this.oConfig.entitySet ? this.oConfig.entitySet : oController.oConfig.entitySet;
            this.oAssert.ok(
              sEntitySet,
              'cannot execute create action. no entitySet. configure the entitySet on the action or on the executing controller'
            );

            // call create
            var oWhen = this.oTransaction.whenDraftNewCreated({
              busyControl: oController.getView(),
              path: '/' + sEntitySet,
              properties: oParams.properties
            });

            oWhen.then(
              function(oResult) {
                if (oParams.nav) {
                  // compute route
                  var sRoute = oController.oConfig.routes && oController.oConfig.routes.child ? oController.oConfig.routes.child : this.oConfig.route;
                  this.oAssert.ok(
                    sRoute,
                    'cannot execute create action. no route. configure the childRoute on the executing controller or the route on this action'
                  );

                  // compute route args
                  var oContext = oResult.context;
                  var oObject = oContext.getObject();
                  var oArgs = this._oRouteArgsFactory.fromObject(sRoute, oObject);

                  // navigate to object with creating a new history entry
                  this.oRouter.navTo(sRoute, oArgs, false);
                }

                // done
                resolve({
                  params: oParams
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
