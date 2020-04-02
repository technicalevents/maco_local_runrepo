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

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.draft.CreateItemAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
        Assert.ok(this.oConfig.route, 'cannot instantiate CreateItemAction. route missing in config');
        Assert.ok(this.oConfig.entityNavProperty, 'cannot instantiate CreateItemAction. entityNavProperty missing in config');
        if (!this.oConfig.hasOwnProperty('nav')) {
          this.oConfig.nav = true;
        }
      },

      execute: function(oParams) {
        return new Promise(
          function(resolve, reject) {
            this._oParams = oParams;
            this._fnResolve = resolve;
            this._fnReject = reject;
            var sPath = this._getCreatePath();
            this._callCreate(sPath);
          }.bind(this)
        );
      },

      _getCreatePath: function() {
        var oContext = this._oParams.tableContext;
        Assert.ok(oContext, 'cannot execute CreateItemAction. no tableContext. This action must be executed on a table');
        return oContext.getPath() + '/' + this.oConfig.entityNavProperty;
      },

      _callCreate: function(sPath) {
        var oData = this._oParams.data ? this._oParams.data : {};
        var transaction = getTransaction(this);
        transaction
          .whenCreated({
            busyControl: this._oParams.busyControl,
            path: sPath,
            data: oData
          })
          .then(this._afterCreate.bind(this), this._fnReject);
      },

      _afterCreate: function(oResult) {
        if (this.oConfig.nav) {
          // compute route args
          var oArgs = RouteArgs.fromObject(this.oComponent.getRouter(), this.oConfig.route, oResult.data);

          // navigate to object with creating a new history entry
          this.oRouter.navTo(this.oConfig.route, oArgs, false);
        }

        // done
        this._fnResolve({
          params: this._oParams
        });
      }
    });
  }
);
