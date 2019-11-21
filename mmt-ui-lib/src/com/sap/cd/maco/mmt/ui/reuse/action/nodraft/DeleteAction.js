sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseAction, bundle, UI5Metadata, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.nodraft.DeleteAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '1..N');
        // TODO check config
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams) {
        this.assertContextParam(oParams);
        return new Promise(
          function(resolve, reject) {
            this._fnResolve = resolve;
            this._fnReject = reject;

            // default nav
            if (!oParams.hasOwnProperty('nav')) {
              oParams.nav = true;
            }

            // get msg
            var aObjects = [];
            oParams.contexts.forEach(function(oContext) {
              aObjects.push(oContext.getObject());
            });
            var sMsg =
              oParams.contexts.length === 1
                ? this.getConfigText('confirmMsg1', 'transactionDeleteConfirm1', aObjects)
                : this.getConfigText('confirmMsgN', 'transactionDeleteConfirmN', aObjects);

            // raise dialog
            this._oParams = oParams;
            this.oMessage
              .confirm({
                msg: sMsg,
                buttonText: bundle.getText('buttonDelete'),
                warning: true
              })
              .then(
                // resolve
                this._deleteEntry.bind(this),
                // reject
                reject
              );
          }.bind(this)
        );
      },

      _deleteEntry: function() {
        this.oTransaction
          .whenDeleted({
            contexts: this._oParams.contexts,
            busyControl: this._oParams.busyControl
          })
          .then(this._afterDelete.bind(this), this._fnReject);
      },

      _afterDelete: function(oResult) {
        // collect objects
        var aObjects = [];
        for (var i = 0; i < this._oParams.contexts.length; i++) {
          var oContext = this._oParams.contexts[i];
          aObjects.push(oContext.getObject());
        }

        // show msg
        var sMsg =
          this._oParams.contexts.length === 1
            ? this.getConfigText('successMsg1', 'transactionDeleteSuccess1', aObjects)
            : this.getConfigText('successMsgN', 'transactionDeleteSuccessN', aObjects);
        this.oMessage.success({
          msg: sMsg
        });

        // nav
        if (
          this._oParams.nav &&
          UI5Metadata.isSubclass(this._oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageController')
        ) {
          // compute route
          var oConConfig = this._oParams.controller.oConfig;
          var sRoute = oConConfig.routes && oConConfig.routes.parent ? oConConfig.routes.parent : this.oConfig.route;
          Assert.ok(sRoute, 'cannot execute DeleteAction. no parent route. configure the parent route on the action or the executing controller');

          // navigate
          this.oNav.navHistoryBackAppTarget(sRoute, {}); // TODO: no params in sub object page case = crash
        }

        this._fnResolve({
          params: this._oParams,
          data: aObjects
        });
      }
    });
  }
);
