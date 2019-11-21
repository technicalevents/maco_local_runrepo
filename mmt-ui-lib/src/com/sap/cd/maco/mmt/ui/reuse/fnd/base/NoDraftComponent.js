sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseComponent',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/transaction/TransactionNoDraft',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/message/MessageModel'
  ],
  function(BaseComponent, TransactionNoDraft, MessageModel) {
    'use strict';

    return BaseComponent.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.base.NoDraftComponent', {
      init: function() {
        // super
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
        this.oTransaction = new TransactionNoDraft({
          component: this,
          model: this.getModel()
        });
        this.baseProperties.push('oTransaction');
      },

      initMessageModel: function() {
        var oMsgModel = new MessageModel();
        this.setModel(oMsgModel, 'message');
      },

      destroyTransaction: function() {
        this.oTransaction.destroy();
      }
    });
  }
);
