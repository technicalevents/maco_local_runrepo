sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateUpdateDialogController'
  ],
  function(CreateUpdateDialogController) {
    'use strict';

    return CreateUpdateDialogController.extend(
      'com.sap.cd.maco.selfservice.ui.app.definecontactrules.view.FileDialog',
      {
        onOpenForCreate: function(oProperties) {
          this.byId('idOwmMarketPartner').setSelectedKey(oProperties.OwnMarketPartner);
        }
      }
    );
  }
);