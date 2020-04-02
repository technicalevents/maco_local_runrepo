/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/message/CallWithMessageHandling',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseAction, bundle, UI5Metadata, CallWithMessageHandling, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.nodraft.UpdateAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
        this.oConfig.minContexts = 1;
        this.oConfig.maxContexts = 1;
      },

      /**
       * @deprecated
       */
      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams) {
        Assert.subclass(
          oParams.controller,
          'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageNoDraftController',
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
