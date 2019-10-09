sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/component/ReuseComponent', 'com/sap/cd/maco/mmt/ui/reuse/transaction/draft/Transaction'], function(
  ReuseComponent,
  Transaction
) {
  'use strict';

  return ReuseComponent.extend('com.sap.cd.maco.mmt.ui.reuse.component.DraftComponent', {
    init: function() {
      // Call super
      ReuseComponent.prototype.init.apply(this, arguments);

      // our stuff
      this.initTransaction();
      this.initMessageModel();
    },

    exit: function() {
      // super
      ReuseComponent.prototype.exit.apply(this, arguments);

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
