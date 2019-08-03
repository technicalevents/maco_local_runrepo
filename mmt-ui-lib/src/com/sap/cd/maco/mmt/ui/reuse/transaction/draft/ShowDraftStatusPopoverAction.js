sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/transaction/draft/DraftStatusPopoverController'
  ],
  function(BaseAction, bundle, DraftStatusPopoverController) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.draft.ShowDraftStatusPopoverAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.apply(this, arguments);
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams, oEvent) {
        return new Promise(
          function(resolve, reject) {
            if (!this._oDraftPopover) {
              this._oDraftPopover = new DraftStatusPopoverController(this.oComponent);
            }

            // determine by
            var sDomRef = oEvent.getParameter('domRef');
            var oBy = sDomRef ? sDomRef : oEvent.getSource();

            // open
            this._oDraftPopover.open(oBy, oParams.contexts[0]);
            resolve();
          }.bind(this)
        );
      }
    });
  }
);
