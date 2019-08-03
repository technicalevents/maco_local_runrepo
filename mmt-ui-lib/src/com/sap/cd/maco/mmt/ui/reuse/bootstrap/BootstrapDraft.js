/*global location*/
sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/bootstrap/Bootstrap', 'com/sap/cd/maco/mmt/ui/reuse/transaction/draft/Transaction'], function(
  Bootstrap,
  Transaction
) {
  'use strict';

  return Bootstrap.extend('com.sap.cd.maco.mmt.ui.reuse.bootstrap.BootstrapDraft', {
    initComponent: function() {
      Bootstrap.prototype.initComponent.apply(this, arguments); // super
      this.initTransaction();
      this.initMessageModel();
    },

    destroyComponent: function() {
      Bootstrap.prototype.destroyComponent.apply(this, arguments); // super
      this.destroyTransaction();
    },

    initTransaction: function() {
      this._oComponent.oTransaction = new Transaction({
        component: this._oComponent,
        model: this._oComponent.getModel()
      });
      this._oComponent.baseProperties.push('oTransaction');
    },

    initMessageModel: function() {
      var oMessageModel = sap.ui
        .getCore()
        .getMessageManager()
        .getMessageModel();
      this._oComponent.setModel(oMessageModel, 'message');
    },

    destroyTransaction: function() {
      this._oComponent.oTransaction.destroy();
    }
  });
});
