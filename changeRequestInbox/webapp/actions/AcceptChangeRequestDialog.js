sap.ui.define([
    "com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateUpdateDialogController",
    "com/sap/cd/maco/mmt/ui/reuse/component/single/getMessage"
],function(CreateUpdateDialogController, GetMessage) {
    "use strict";
    return CreateUpdateDialogController.extend("com.sap.cd.maco.operation.ui.app.changeRequestInbox.actions.AcceptChangeRequestDialog",{
    	
    	/**
		 * Event is triggered on press submit button in dialog box
		 * @public
		 */
        onSubmit: function() {
			var sPath = this.getFragment().getBindingContext().getPath();
            var oData = jQuery.extend(true, {}, this.oModel.getProperty(sPath));
            var oUpdateData = {
            	Action: "A",
            	EmailAddress: oData.EmailAddress,
            	ValidFrom: oData.ValidFrom,
            	ValidTo: oData.ValidTo
            };
            
			this.oTransaction.whenUpdated({
				path: sPath,
				data: oUpdateData,
				busyControl: this.getFragment()
			}).then(function(oResponse) {
				this.getFragment().close();
				var sMessage = this._getConfigText("updateSuccessMsg", "transactionDialogUpdateSuccess");
				GetMessage(this).success({msg: sMessage});
			}.bind(this));
        }
    });
});