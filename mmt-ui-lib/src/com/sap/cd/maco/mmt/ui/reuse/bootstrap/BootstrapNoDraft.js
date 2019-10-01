/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/bootstrap/Bootstrap',
    'com/sap/cd/maco/mmt/ui/reuse/transaction/nodraft/Transaction',
    'com/sap/cd/maco/mmt/ui/reuse/message/MessageModel'
  ],
  function(Bootstrap, Transaction, MessageModel) {
    'use strict';

    return Bootstrap.extend('com.sap.cd.maco.mmt.ui.reuse.bootstrap.BootstrapNoDraft', {
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

      destroyTransaction: function() {
        this._oComponent.oTransaction.destroy();
      },

      initMessageModel: function() {
        var oMsgModel = new MessageModel();
        this._oComponent.setModel(oMsgModel, 'message');
      }
    });
  }
);
