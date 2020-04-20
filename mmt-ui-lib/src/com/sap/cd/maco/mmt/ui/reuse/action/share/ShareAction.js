/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/FragmentAction',
    'com/sap/cd/maco/mmt/ui/reuse/action/share/SaveAsTileAction',
    'com/sap/cd/maco/mmt/ui/reuse/action/share/SendEmailAction'
  ],
  function(FragmentAction, SaveAsTileAction, SendEmailAction) {
    'use strict';

    /**
     * config:
     *  - objectTextProperty
     *  - objectIdProperty
     *  - appTitleMsgKey
     *  - setServiceUrl (optional)
     *
     * params:
     *  - controller
     *  - byControl
     */
    return FragmentAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.share.ShareAction', {
      constructor: function(oComponent, oConfig) {
        FragmentAction.call(this, oComponent, oConfig, undefined, 'ShareActionMenu', 'com.sap.cd.maco.mmt.ui.reuse.action.share.ShareActionMenu');
        this._mActions = {};
        this._mActions.saveAsTile = new SaveAsTileAction(oComponent, oConfig);
        this._mActions.sendEmail = new SendEmailAction(oComponent, oConfig);
      },

      destroy: function() {
        FragmentAction.prototype.destroy.apply(this, arguments);
        for (var sActionName in this._mActions) {
          var oAction = this._mActions[sActionName];
          oAction.destroy();
        }
      },

      execute: function(oParams) {
        return new Promise(
          function(resolve, reject) {
            // keep references
            this._oParams = oParams;
            this._fnResolve = resolve;
            this._fnReject = reject;

            // open
            // TODO remove else after actions are no longer executed via onAction
            var oByControl = this._oParams.byControl ? this._oParams.byControl : this._oParams.event.getSource();
            this.getFragment().openBy(oByControl);
          }.bind(this)
        );
      },

      _onAction: function(oEvent) {
        var oSource = oEvent.getSource();
        var sActionName = oSource.data('action');
        var oAction = this._mActions[sActionName];
        oAction.execute(this._oParams).then(this._fnResolve, this._fnReject);
      }
    });
  }
);
