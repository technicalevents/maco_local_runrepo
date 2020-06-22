sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseViewController', 'com/sap/cd/maco/mmt/ui/reuse/fnd/ContentDensity'], function(
  BaseViewController,
  ContentDensity
) {
  'use strict';

  return BaseViewController.extend('com.sap.cd.maco.mmt.ui.reuse.controller.app.App', {
    onInit: function() {
      // set app busy without delay
      var oApp = this.byId('app');
      var iDelay = oApp.getBusyIndicatorDelay();
      oApp.setBusyIndicatorDelay(0);
      oApp.setBusy(true);

      // reset busy after metadata has been loaded
      var oWhenMetadataLoaded = this.getOwnerComponent()
        .getModel()
        .metadataLoaded();
      oWhenMetadataLoaded.then(function() {
        oApp.setBusy(false);
        oApp.setBusyIndicatorDelay(iDelay);
      });

      // apply content density mode to root view
      var sContentDensity = ContentDensity.get();
      if (sContentDensity) {
        this.getView().addStyleClass(sContentDensity);
      }
    }
  });
});
