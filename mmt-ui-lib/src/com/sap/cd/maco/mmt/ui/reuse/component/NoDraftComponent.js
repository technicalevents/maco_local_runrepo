sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/component/ReuseComponent',
    'com/sap/cd/maco/mmt/ui/reuse/controller/base/ControllerRegistry',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/message/ErrorManager',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Message',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/nav/Navigation',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/transaction/TransactionNoDraft',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/message/MessageModel'
  ],
  function(ReuseComponent, ControllerRegistry, ErrorManager, Message, Navigation, TransactionNoDraft, MessageModel) {
    'use strict';

    return ReuseComponent.extend('com.sap.cd.maco.mmt.ui.reuse.component.NoDraftComponent', {
      init: function() {
        // super
        ReuseComponent.prototype.init.apply(this, arguments);

        // singles
        this.mSingles.controllerRegistry = new ControllerRegistry();
        this.mSingles.errorManager = new ErrorManager(this);
        this.mSingles.message = new Message(this);
        this.mSingles.messageManager = sap.ui.getCore().getMessageManager();
        this.mSingles.nav = new Navigation(this);
        this.mSingles.transaction = new TransactionNoDraft(this);

        // message model
        var oMsgModel = new MessageModel();
        this.setModel(oMsgModel, 'message');
      }
    });
  }
);
