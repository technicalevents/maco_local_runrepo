/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getMessage',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getNav'
  ],
  function(BaseAction, bundle, UI5Metadata, Assert, getMessage, getNav) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.nodraft.CancelAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
        this.oConfig.minContexts = 1;
        this.oConfig.maxContexts = 1;
      },

      /**
       * @deprecated
       */
      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams) {
        // keep stuff
        this._oParams = oParams;
        this._oContext = oParams.contexts[0];
        this._oObject = this._oContext.getObject();

        // check controller
        Assert.subclass(
          oParams.controller,
          'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageNoDraftController',
          'action must be executed on a subclass of com.sap.cd.maco.mmt.ui.reuse.draft.ObjectPageNoDraftController'
        );

        return new Promise(
          function(resolve, reject) {
            this._fnResolve = resolve;
            this._fnReject = reject;

            if (this.oModel.hasPendingChanges()) {
              getMessage(this)
                .confirm({
                  msg: bundle.getText('transactionCancelConfirm'),
                  buttonText: bundle.getText('buttonDiscard'),
                  popover: true,
                  byControl: oParams.event.getSource()
                })
                .then(this._onConfirmed.bind(this), reject);
            } else {
              this._onConfirmed();
            }
          }.bind(this)
        );
      },

      _onConfirmed: function() {
        // reset all model changes
        if (this.oModel.hasPendingChanges()) {
          this.oModel.resetChanges();
        }

        // set object page mode
        var sMode = this._oParams.controller.getMode();
        if ('Create' === sMode) {
          // navigate back
          var sParentRoute = null; // would be only necessary in deep link scenario ... but there is no deep link for create :-)
          getNav(this).navHistoryBackAppTarget(sParentRoute);
        } else if ('Update' === sMode) {
          // just change the mode
          this._oParams.controller.setMode('Display');
        } else {
          // error
          Assert.ok(false, 'cannot execute cancel action. unhandled object page mode on cancel: ' + sMode);
        }

        // done
        this._fnResolve({
          params: this._oParams
        });
      }
    });
  }
);
