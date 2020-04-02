sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/component/ReuseComponent',
    'com/sap/cd/maco/mmt/ui/reuse/controller/base/ControllerRegistry',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/message/ErrorManager',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Message',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/nav/Navigation',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/transaction/TransactionDraft'
  ],
  function(ReuseComponent, ControllerRegistry, ErrorManager, Message, Navigation, TransactionDraft) {
    'use strict';

    return ReuseComponent.extend('com.sap.cd.maco.mmt.ui.reuse.component.DraftComponent', {
      init: function() {
        // super
        ReuseComponent.prototype.init.apply(this, arguments);

        // singles
        var oMsgManager = sap.ui.getCore().getMessageManager();
        this.mSingles.controllerRegistry = new ControllerRegistry();
        this.mSingles.errorManager = new ErrorManager(this);
        this.mSingles.message = new Message(this);
        this.mSingles.messageManager = oMsgManager;
        this.mSingles.nav = new Navigation(this);
        this.mSingles.transaction = new TransactionDraft(this);

        // message model
        var oMessageModel = oMsgManager.getMessageModel();
        this.setModel(oMessageModel, 'message');
      }
    });
  }
);
