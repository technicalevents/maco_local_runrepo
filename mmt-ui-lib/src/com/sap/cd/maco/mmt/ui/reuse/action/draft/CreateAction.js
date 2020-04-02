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

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.draft.CreateAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
        // default config
        if (!this.oConfig.hasOwnProperty('nav')) {
          this.oConfig.nav = true;
        }
      },

      execute: function(oParams) {
        return new Promise(
          function(resolve, reject) {
            // determine entity set
            var sEntitySet = this.oConfig.entitySet ? this.oConfig.entitySet : oParams.controller.oConfig.entitySet;
            Assert.ok(sEntitySet, 'cannot execute create action. no entitySet. configure the entitySet on the action or on the executing controller');

            // call create
            var oTransaction = getTransaction(this);
            var oWhen = oTransaction.whenDraftNewCreated({
              busyControl: oParams.controller.getView(),
              path: '/' + sEntitySet,
              properties: oParams.properties
            });

            oWhen.then(
              function(oResult) {
                if (this.oConfig.nav) {
                  // compute route
                  var oConConfig = oParams.controller.oConfig;
                  var sRoute = oConConfig.routes && oConConfig.routes.child ? oConConfig.routes.child : this.oConfig.route;
                  Assert.ok(
                    sRoute,
                    'cannot execute create action. no route. configure the childRoute on the executing controller or the route on this action'
                  );

                  // compute route args
                  var oContext = oResult.context;
                  var oObject = oContext.getObject();
                  var oArgs = RouteArgs.fromObject(this.oComponent.getRouter(), sRoute, oObject);

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
