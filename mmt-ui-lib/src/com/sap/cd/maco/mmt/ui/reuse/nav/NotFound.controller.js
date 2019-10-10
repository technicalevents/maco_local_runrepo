sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/base/BaseViewController', 'sap/m/InstanceManager', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle'], function(
  BaseViewController,
  InstanceManager,
  bundle
) {
  'use strict';

  return BaseViewController.extend('com.sap.cd.maco.mmt.ui.reuse.nav.NotFound', {
    onInit: function() {
      BaseViewController.prototype.onInit.apply(this, arguments);

      // register on display events
      var oTarget = this.oRouter.getTarget('notFound');
      if (!oTarget) {
        throw Error('missing a notFound target in the routing config');
      }
      oTarget.attachDisplay(this.onDisplay.bind(this));
    },

    onDisplay: function(oEvent) {
      // get message
      var oData = oEvent.getParameter('data');
      var sMessage = oData.message ? oData.message : bundle.get().getText('navNotFoundDefault');

      // set app model
      this.byId('page').setText(sMessage);

      // close potential "not found" dialogs for errors from server
      // (after UI5 has opened them)
      setTimeout(function() {
        InstanceManager.closeAllDialogs();
      }, 0);
    }
  });
});
