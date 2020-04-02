sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/action/draft/DraftStatusPopoverController'
  ],
  function(BaseAction, bundle, DraftStatusPopoverController) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.draft.ShowDraftStatusPopoverAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
        this.oConfig.minContexts = 1;
        this.oConfig.maxContexts = 1;
      },

      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams) {
        return new Promise(
          function(resolve, reject) {
            if (!this._oDraftPopover) {
              this._oDraftPopover = new DraftStatusPopoverController(this.oComponent);
            }

            // determine by
            var sDomRef = oParams.event.getParameter('domRef');
            var oBy = sDomRef ? sDomRef : oParams.event.getSource();

            // open
            this._oDraftPopover.open(oBy, oParams.contexts[0]);
            resolve();
          }.bind(this)
        );
      }
    });
  }
);
