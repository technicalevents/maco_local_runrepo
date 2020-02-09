sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/objectPage/ObjectPageNoDraftController'], function(
  ObjectPageNoDraftController
) {
  'use strict';

  return ObjectPageNoDraftController.extend(
    'com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.PartnerPage',
    {
      onInit: function() {
        var oPartnerActions = this.getOwnerComponent().actions.partner;
        ObjectPageNoDraftController.prototype.onInit.call(this, {
          entitySet: 'PartnerMasterData',
          i18n: { notFoundMsg: this.notFoundMsg.bind(this) },
          controls: {
            objectPage: 'objectPage'
          },
          routes: {
            this: 'partnerPage',
            parent: 'listReport'
          },
          actions: {
            update: oPartnerActions.update,
            delete: oPartnerActions.delete
          }
        });
      },

      notFoundMsg: function(oRouteArgs) {
        return this.oBundle.getText('partnerNotFound', [oRouteArgs.Pid, oRouteArgs.UUID]);
      }
    }
  );
});
