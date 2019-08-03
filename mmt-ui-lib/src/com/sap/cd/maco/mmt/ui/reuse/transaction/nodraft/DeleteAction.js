sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/base/BaseAction', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle'], function(BaseAction, bundle) {
  'use strict';

  return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.nodraft.DeleteAction', {
    constructor: function(oComponent, oConfig) {
      BaseAction.apply(this, arguments);
      // TODO check config
    },

    enabled: function(aContexts) {
      return aContexts.length > 0;
    },

    execute: function(oParams, oEvent, oController) {
      this.assertContextParam(oParams);
      return new Promise(
        function(resolve, reject) {
          this._fnResolve = resolve;
          this._fnReject = reject;

          // get msg
          var aObjects = [];
          oParams.contexts.forEach(function(oContext) {
            aObjects.push(oContext.getObject());
          });
          var sMsg =
            oParams.contexts.length === 1
              ? this.getConfigText('confirmMsg1', 'transactionDeleteConfirm1', aObjects)
              : this.getConfigText('confirmMsgN', 'transactionDeleteConfirmN', aObjects);

          // raise dialog
          this._oParams = oParams;
          this.oMessage
            .confirm({
              msg: sMsg,
              buttonText: bundle.get().getText('buttonDelete'),
              warning: true
            })
            .then(
              // resolve
              this._deleteEntry.bind(this),
              // reject
              reject
            );
        }.bind(this)
      );
    },

    _deleteEntry: function() {
      // collect objects
      var aObjects = [];
      for (var i = 0; i < this._oParams.contexts.length; i++) {
        var oContext = this._oParams.contexts[i];
        aObjects.push(oContext.getObject());
      }

      this.oTransaction
        .whenDeleted({
          contexts: this._oParams.contexts,
          busyControl: this._oParams.busyControl
        })
        .then(
          // resolve
          function(oResult) {
            // get msg
            var sMsg =
              this._oParams.contexts.length === 1
                ? this.getConfigText('successMsg1', 'transactionDeleteSuccess1', aObjects)
                : this.getConfigText('successMsgN', 'transactionDeleteSuccessN', aObjects);
            // show message
            this.oMessage.success({
              msg: sMsg
            });

            this._fnResolve({
              params: this._oParams,
              data: aObjects
            });
          }.bind(this),

          // reject
          this._fnReject
        );
    }
  });
});
