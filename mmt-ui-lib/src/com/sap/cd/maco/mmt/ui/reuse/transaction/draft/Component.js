sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/base/BaseComponent', 'com/sap/cd/maco/mmt/ui/reuse/transaction/draft/Transaction'], function(
  BaseComponent,
  Transaction
) {
  'use strict';

  return BaseComponent.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.draft.Component', {
    init: function() {
      // Call super
      BaseComponent.prototype.init.apply(this, arguments);

      // our stuff
      this.initTransaction();
      this.initMessageModel();
    },

    exit: function() {
      this.destroyTransaction();
    },

    initTransaction: function() {
      this.oTransaction = new Transaction({
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
