/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/_/UI5MetadataTool',
    'com/sap/cd/maco/mmt/ui/reuse/message/CallWithMessageHandling'
  ],
  function(BaseAction, bundle, UI5MetadataTool, CallWithMessageHandling) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.nodraft.UpdateAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.apply(this, arguments);
        this._oUI5MetadataTool = new UI5MetadataTool();
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams, oEvent, oController) {
        this.oAssert.subclass(
          oController,
          'com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageNoDraftController',
          'cannot execute submit action. controller must be a subclass of ObjectPageNoDraftController'
        );

        return new Promise(
          function(resolve, reject) {
            // change mode
            oController.setMode('Update');

            // reset all model changes
            if (this.oModel.hasPendingChanges()) {
              this.oModel.resetChanges();
            }

            // reset message handling
            var oCallWith = new CallWithMessageHandling(oController);
            oCallWith.reset();

            // done
            resolve({
              params: oParams
            });
          }.bind(this)
        );
      }
    });
  }
);
