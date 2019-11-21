sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/message/CallWithMessageHandling',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseAction, bundle, CallWithMessageHandling, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.nodraft.SaveAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '0');
        if (!oConfig.hasOwnProperty('manageMessagesClient')) {
          oConfig.manageMessagesClient = true;
        }
        if (!oConfig.hasOwnProperty('manageMessagesServer')) {
          oConfig.manageMessagesServer = true;
        }
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams) {
        Assert.subclass(
          oParams.controller,
          'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageNoDraftController',
          'cannot execute save action. controller must be a subclass of ObjectPageNoDraftController'
        );

        return new Promise(
          function(resolve, reject) {
            // changes?
            if (!this.oModel.hasPendingChanges()) {
              var sMsg = bundle.getText('transactionSubmitNoChanges');
              this.oMessage.info({ msg: sMsg });
              reject();
              return;
            }

            var oCallWith = new CallWithMessageHandling(oParams.controller);
            var fnCall = this.oTransaction.whenSubmitted.bind(this.oTransaction, oParams);
            var oWhen = oCallWith.whenCalled(fnCall, this.oConfig.manageMessagesClient, this.oConfig.manageMessagesServer);
            oWhen.then(
              function(oResult) {
                var sMode = oParams.controller.getMode();
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
                  oParams.controller.setMode('Display');
                } else {
                  // error
                  Assert.ok(false, 'cannot execute save action. unhandled object page mode on cancel: ' + sMode);
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
