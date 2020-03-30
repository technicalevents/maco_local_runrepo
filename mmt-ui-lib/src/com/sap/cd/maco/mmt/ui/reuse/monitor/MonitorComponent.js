sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseComponent",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/transaction/TransactionNoDraft"
  ],
  function(BaseComponent, TransactionNoDraft) {
	"use strict";

    return BaseComponent.extend("com.sap.cd.maco.mmt.ui.reuse.fnd.base.MonitorComponent", {
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
			this.oTransaction.destroy();
		},
		
		initTransaction: function() {
			this.oTransaction = new TransactionNoDraft({
				component: this,
				model: this.getModel()
			});
			this.baseProperties.push("oTransaction");
		},
		
		initMessageModel: function() {
			var oMessageModel = sap.ui.getCore().getMessageManager().getMessageModel();
			this.setModel(oMessageModel, "message");
		}
    });
});