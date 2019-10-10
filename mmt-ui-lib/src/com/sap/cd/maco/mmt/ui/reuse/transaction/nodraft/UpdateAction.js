/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/base/UI5MetadataTool',
    'com/sap/cd/maco/mmt/ui/reuse/message/CallWithMessageHandling'
  ],
  function(BaseAction, bundle, UI5MetadataTool, CallWithMessageHandling) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.nodraft.UpdateAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '1');
        this._oUI5MetadataTool = new UI5MetadataTool();
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams) {
        this.oAssert.subclass(
          oParams.controller,
          'com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageNoDraftController',
          'cannot execute submit action. controller must be a subclass of ObjectPageNoDraftController'
        );

        return new Promise(
          function(resolve, reject) {
            // change mode
            oParams.controller.setMode('Update');

            // reset all model changes
            if (this.oModel.hasPendingChanges()) {
              this.oModel.resetChanges();
            }

            // reset message handling
            var oCallWith = new CallWithMessageHandling(oParams.controller);
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
