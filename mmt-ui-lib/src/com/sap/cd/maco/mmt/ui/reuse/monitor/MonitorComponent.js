sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/component/BaseComponent', 'com/sap/cd/maco/mmt/ui/reuse/fnd/transaction/TransactionNoDraft'], function(
  BaseComponent,
  TransactionNoDraft
) {
  'use strict';

  return BaseComponent.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.base.MonitorComponent', {
    init: function() {
      // super
      BaseComponent.prototype.init.apply(this, arguments);

      // singles
      this.mSingles.transaction = new TransactionNoDraft(this);

      // message model
      var oMessageModel = sap.ui
        .getCore()
        .getMessageManager()
        .getMessageModel();
      this.setModel(oMessageModel, 'message');
    }
  });
});
