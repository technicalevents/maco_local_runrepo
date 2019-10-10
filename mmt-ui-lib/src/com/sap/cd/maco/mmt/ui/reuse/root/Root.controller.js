sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/base/BaseViewController', 'com/sap/cd/maco/mmt/ui/reuse/device/contentDensity'], function(
  BaseViewController,
  contentDensity
) {
  'use strict';

  return BaseViewController.extend('com.sap.cd.maco.mmt.ui.reuse.root.Root', {
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
      var sContentDensity = contentDensity.get();
      if (sContentDensity) {
        this.getView().addStyleClass(sContentDensity);
      }
    }
  });
});
