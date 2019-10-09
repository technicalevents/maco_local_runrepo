sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/component/ReuseComponent',
    'com/sap/cd/maco/mmt/ui/reuse/transaction/nodraft/Transaction',
    'com/sap/cd/maco/mmt/ui/reuse/message/MessageModel'
  ],
  function(ReuseComponent, Transaction, MessageModel) {
    'use strict';

    return ReuseComponent.extend('com.sap.cd.maco.mmt.ui.reuse.component.NoDraftComponent', {
      init: function() {
        // super
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
        var oMsgModel = new MessageModel();
        this.setModel(oMsgModel, 'message');
      },

      destroyTransaction: function() {
        this.oTransaction.destroy();
      }
    });
  }
);
