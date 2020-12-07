sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/FragmentAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getMessage',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getNav',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getTransaction'
  ],
  function(FragmentAction, bundle, UI5Metadata, Assert, getMessage, getNav, getTransaction) {
    'use strict';

    /**
     * controller config:
     *  - routes.parent (string)
     *
     * config:
     *  - nav (boolean, optional, default: true)
     *  - route (string, mandatory)
     *  - confirmMsg1 (string, optional)
     *  - confirmMsgN (string, optional)
     *
     * params:
     *  - controller
     *  - busyControl
     *  - contexts
     */
    return FragmentAction.extend('com.sap.cd.maco.mmt.ui.reuse.mmt.CriticalDeleteAction', {
      constructor: function(oComponent, oConfig) {
        FragmentAction.call(this, oComponent, oConfig, null, 'CriticalDeleteAction', 'com.sap.cd.maco.mmt.ui.reuse.mmt.CriticalDeleteAction');
        this.oConfig.minContexts = 1;
        // default config
        if (!this.oConfig.hasOwnProperty('nav')) {
          this.oConfig.nav = true;
        }
      },

      execute: function(oParams) {
        this.assertContextParam(oParams);
        return new Promise(
          function(resolve, reject) {
            this._fnResolve = resolve;
            this._fnReject = reject;
            this._oParams = oParams;

            // set msg
            var oDialog = this.getFragment();
            var aObjects = [];
            oParams.contexts.forEach(function(oContext) {
              aObjects.push(oContext.getObject());
            });
            var sMsg =
              oParams.contexts.length === 1
                ? this.getConfigText('confirmMsg1', 'transactionDeleteConfirm1', aObjects)
                : this.getConfigText('confirmMsgN', 'transactionDeleteConfirmN', aObjects);
            this.byId('text').setText(sMsg);

            // show dialog
            this._wait(3, 0);
            oDialog.open();
          }.bind(this)
        );
      },

      _wait: function(iCount, iDelay) {
        setTimeout(
          function() {
            if (iCount === 0) {
              this.byId('deleteButton').setText(bundle.getText('buttonDelete'));
              this.byId('deleteButton').setEnabled(true);
            } else {
              this.byId('deleteButton').setText(bundle.getText('criticalDeleteButtonText', [iCount]));
              this.byId('deleteButton').setEnabled(false);
              this._wait(iCount - 1, 1000);
            }
          }.bind(this),
          iDelay
        );
      },

      _afterClose: function() {
        this._fnReject();
      },

      _cancel: function() {
        this.getFragment().close();
        this._fnReject();
      },

      _delete: function() {
        this.getFragment().close();
        var oTransaction = getTransaction(this);
        oTransaction
          .whenDeleted({
            contexts: this._oParams.contexts,
            busyControl: this._oParams.busyControl
          })
          .then(this._afterDelete.bind(this), this._fnReject);
      },

      _afterDelete: function(oResult) {
        // collect objects
        var aObjects = [];
        for (var i = 0; i < this._oParams.contexts.length; i++) {
          var oContext = this._oParams.contexts[i];
          aObjects.push(oContext.getObject());
        }

        // show msg
        var sMsg =
          this._oParams.contexts.length === 1
            ? this.getConfigText('successMsg1', 'transactionDeleteSuccess1', aObjects)
            : this.getConfigText('successMsgN', 'transactionDeleteSuccessN', aObjects);
        getMessage(this).success({
          msg: sMsg
        });

        // nav
        if (
          this.oConfig.nav &&
          UI5Metadata.isSubclass(this._oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageController')
        ) {
          // compute route
          var oConConfig = this._oParams.controller.oConfig;
          var sRoute = oConConfig.routes && oConConfig.routes.parent ? oConConfig.routes.parent : this.oConfig.route;
          Assert.ok(sRoute, 'cannot execute DeleteAction. no parent route. configure the parent route on the action or the executing controller');

          // navigate
          getNav(this).navHistoryBackAppTarget(sRoute, {}); // TODO: no params in sub object page case = crash
        }

        this._fnResolve({
          params: this._oParams,
          data: aObjects
        });
      }
    });
  }
);
