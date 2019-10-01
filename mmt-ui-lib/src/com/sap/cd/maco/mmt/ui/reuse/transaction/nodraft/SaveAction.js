sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/message/CallWithMessageHandling',
    'com/sap/cd/maco/mmt/ui/reuse/nav/RouteArgsFactory'
  ],
  function(BaseAction, bundle, CallWithMessageHandling, RouteArgsFactory) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.nodraft.SaveAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '0');
        if (!oConfig.hasOwnProperty('manageMessagesClient')) {
          oConfig.manageMessagesClient = true;
        }
        if (!oConfig.hasOwnProperty('manageMessagesServer')) {
          oConfig.manageMessagesServer = true;
        }
        this._oRouteArgsFactory = new RouteArgsFactory(this.oComponent);
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams, oEvent, oController) {
        this.oAssert.subclass(
          oController,
          'com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageNoDraftController',
          'cannot execute save action. controller must be a subclass of ObjectPageNoDraftController'
        );

        return new Promise(
          function(resolve, reject) {
            // changes?
            if (!this.oModel.hasPendingChanges()) {
              var sMsg = bundle.get().getText('transactionSubmitNoChanges');
              this.oMessage.info({ msg: sMsg });
              reject();
              return;
            }

            var oCallWith = new CallWithMessageHandling(oController);
            var fnCall = this.oTransaction.whenSubmitted.bind(this.oTransaction, oParams);
            var oWhen = oCallWith.whenCalled(fnCall, this.oConfig.manageMessagesClient, this.oConfig.manageMessagesServer);
            oWhen.then(
              function(oResult) {
                var sMode = oController.getMode();
                if ('Create' === sMode) {
                  // show message
                  var sMsg = this.getConfigText('createSuccessMsg', 'transactionSubmitCreateSuccess', null);
                  this.oMessage.success({
                    msg: sMsg
                  });

                  // navigate back
                  var sParentRoute = null; // would be only necessary in deep link scenario ... but there is no deep link for update :-)
                  this.oNav.navHistoryBackAppTarget(sParentRoute);
                } else if ('Update' === sMode) {
                  // show message
                  var sMsg = this.getConfigText('updateSuccessMsg', 'transactionSubmitUpdateSuccess', null);
                  this.oMessage.success({
                    msg: sMsg
                  });
                  // change mode
                  oController.setMode('Display');
                } else {
                  // error
                  this.oAssert.ok(false, 'cannot execute save action. unhandled object page mode on cancel: ' + sMode);
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
