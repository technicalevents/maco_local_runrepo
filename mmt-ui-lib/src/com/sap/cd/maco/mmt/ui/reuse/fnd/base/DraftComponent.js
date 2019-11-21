sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseComponent', 'com/sap/cd/maco/mmt/ui/reuse/fnd/transaction/TransactionDraft'], function(
  BaseComponent,
  TransactionDraft
) {
  'use strict';

  return BaseComponent.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.base.DraftComponent', {
    init: function() {
      // Call super
      BaseComponent.prototype.init.apply(this, arguments);

      // our stuff
      this.initTransaction();
      this.initMessageModel();
    },

    exit: function() {
      // super
      BaseComponent.prototype.exit.apply(this, arguments);

      this.destroyTransaction();
    },

    initTransaction: function() {
      this.oTransaction = new TransactionDraft({
        component: this,
        model: this.getModel()
      });
      this.baseProperties.push('oTransaction');
    },

    initMessageModel: function() {
      var oMessageModel = sap.ui
        .getCore()
        .getMessageManager()
        .getMessageModel();
      this.setModel(oMessageModel, 'message');
    },

    destroyTransaction: function() {
      this.oTransaction.destroy();
    }
  });
});
