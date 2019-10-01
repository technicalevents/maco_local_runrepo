sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/base/BaseComponent',
    'com/sap/cd/maco/mmt/ui/reuse/transaction/nodraft/Transaction',
    'com/sap/cd/maco/mmt/ui/reuse/message/MessageModel'
  ],
  function(BaseComponent, Transaction, MessageModel) {
    'use strict';

    return BaseComponent.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.nodraft.Component', {
      init: function() {
        // super
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
        var oMsgModel = new MessageModel();
        this.setModel(oMsgModel, 'message');
      },

      destroyTransaction: function() {
        this.oTransaction.destroy();
      }
    });
  }
);
