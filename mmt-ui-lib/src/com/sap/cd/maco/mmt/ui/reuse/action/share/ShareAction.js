/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/action/share/SaveAsTileAction',
    'com/sap/cd/maco/mmt/ui/reuse/action/share/SendEmailAction'
  ],
  function(BaseAction, SaveAsTileAction, SendEmailAction) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.share.ShareAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '0');
        this._oSaveAsTileAction = new SaveAsTileAction(oComponent, oConfig);
        this._oSendEmailAction = new SendEmailAction(oComponent, oConfig);
      },

      destroy: function() {
        if (this._oMenu) {
          this._oMenu.destroy();
        }
        this._oSaveAsTileAction.destroy();
        this._oSendEmailAction.destroy();
      },

      execute: function(oParams) {
        return new Promise(
          function(resolve, reject) {
            // keep references
            this._oParams = oParams;
            this._fnResolve = resolve;
            this._fnReject = reject;

            // lazy create menu
            if (!this._oMenu) {
              this._oMenu = sap.ui.xmlfragment('com.sap.cd.maco.mmt.ui.reuse.action.share.ShareActionMenu', this);
            }

            // open
            var oSource = oParams.event.getSource();
            this._oMenu.openBy(oSource);
          }.bind(this)
        );
      },

      onActionSaveAsTile: function(oEvent) {
        this._executeAction(this._oSaveAsTileAction, oEvent);
      },

      onActionSendEmail: function(oEvent) {
        this._executeAction(this._oSendEmailAction, oEvent);
      },

      _executeAction: function(oAction, oEvent) {
        var oCon = this._oParams.controller;
        var oParams = {
          busyControl: oCon.getView(),
          contexts: [oCon.getView().getBindingContext()],
          controller: oCon,
          event: oEvent
        };
        oAction.execute(oParams).then(this._fnResolve, this._fnReject);
      }
    });
  }
);
