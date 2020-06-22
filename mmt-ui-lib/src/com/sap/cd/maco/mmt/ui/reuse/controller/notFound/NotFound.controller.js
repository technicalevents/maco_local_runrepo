sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/controller/base/BaseViewController',
    'sap/m/InstanceManager',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseViewController, InstanceManager, bundle, Assert) {
    'use strict';

    return BaseViewController.extend('com.sap.cd.maco.mmt.ui.reuse.controller.notFound.NotFound', {
      onInit: function() {
        BaseViewController.prototype.onInit.apply(this, arguments);
        this._registerTargetDisplay();
      },

      _registerTargetDisplay: function() {
        var oTarget = this.oRouter.getTarget('notFound');
        Assert.ok(oTarget, 'Cannot init not found page. missing a notFound target in the manifests routing config');
        oTarget.attachDisplay(this._onTargetDisplay.bind(this));
      },

      _onTargetDisplay: function(oEvent) {
        var oData = oEvent.getParameter('data');
        this._setMessage(oData);
        this._closeErrorDialogs();
      },

      _setMessage: function(oData) {
        var sMessage = oData.message ? oData.message : bundle.getText('controllerNotFoundDefaultMessage');
        this.byId('page').setText(sMessage);
      },

      /**
       * Close potential error dialogs opened by the generic error handler
       */
      _closeErrorDialogs: function() {
        setTimeout(function() {
          InstanceManager.closeAllDialogs();
        }, 0);
      }
    });
  }
);
