sap.ui.define([
    "com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateUpdateDialogController",
    "com/sap/cd/maco/mmt/ui/reuse/component/single/getMessage"
],function(CreateUpdateDialogController, GetMessage) {
    "use strict";
    return CreateUpdateDialogController.extend("com.sap.cd.maco.operation.ui.app.changerequestinbox.actions.AcceptCertChangeRequestDialog",{
    	
    	/**
		 * Event is triggered on press submit button in dialog box
		 * @public
		 */
        onSubmit: function() {
			var sPath = this.getFragment().getBindingContext().getPath();
            var oData = jQuery.extend(true, {}, this.oModel.getProperty(sPath));
            var oUpdateData = {
            	Action: "A",
            	BODocNo: oData.BODocNo,
            	ChangeRequestType: oData.ChangeRequestType
            };
            
			this.oTransaction.whenUpdated({
				path: sPath,
				data: oUpdateData,
				busyControl: this.getFragment()
			}).then(function(oResponse) {
				this.getFragment().close();
				GetMessage(this).success({msg: JSON.parse(oResponse.response.headers["sap-message"]).message});
			}.bind(this));
        }
    });
});