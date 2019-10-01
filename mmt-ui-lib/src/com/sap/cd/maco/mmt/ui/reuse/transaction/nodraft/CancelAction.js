/*global location*/
sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/base/BaseAction', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle', 'com/sap/cd/maco/mmt/ui/reuse/_/UI5MetadataTool'],
  function(BaseAction, bundle, UI5MetadataTool) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.nodraft.CancelAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '1');
        this._oUI5MetadataTool = new UI5MetadataTool();
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams, oEvent, oController) {
        // keep stuff
        this._oParams = oParams;
        this._oContext = oParams.contexts[0];
        this._oObject = this._oContext.getObject();
        this._oController = oController;

        // check controller
        this.oAssert.subclass(
          oController,
          'com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageNoDraftController',
          'action must be executed on a subclass of com.sap.cd.maco.mmt.ui.reuse.draft.ObjectPageNoDraftController'
        );

        return new Promise(
          function(resolve, reject) {
            this._fnResolve = resolve;
            this._fnReject = reject;

            if (this.oModel.hasPendingChanges()) {
              this.oMessage
                .confirm({
                  msg: bundle.get().getText('transactionCancelConfirm'),
                  buttonText: bundle.get().getText('buttonDiscard'),
                  popover: true,
                  byControl: oEvent.getSource()
                })
                .then(this._onConfirmed.bind(this), reject);
            } else {
              this._onConfirmed();
            }
          }.bind(this)
        );
      },

      _onConfirmed: function() {
        // reset all model changes
        if (this.oModel.hasPendingChanges()) {
          this.oModel.resetChanges();
        }

        // set object page mode
        var sMode = this._oController.getMode();
        if ('Create' === sMode) {
          // navigate back
          var sParentRoute = null; // would be only necessary in deep link scenario ... but there is no deep link for create :-)
          this.oNav.navHistoryBackAppTarget(sParentRoute);
        } else if ('Update' === sMode) {
          // just change the mode
          this._oController.setMode('Display');
        } else {
          // error
          this.oAssert.ok(false, 'cannot execute cancel action. unhandled object page mode on cancel: ' + sMode);
        }

        // done
        this._fnResolve({
          params: this._oParams
        });
      }
    });
  }
);
