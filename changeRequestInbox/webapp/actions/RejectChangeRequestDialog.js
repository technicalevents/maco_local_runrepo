sap.ui.define([
    "com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateUpdateDialogController"
],function(CreateUpdateDialogController) {
    "use strict";
    return CreateUpdateDialogController.extend("com.sap.cd.maco.operation.ui.app.changeRequestInbox.actions.RejectChangeRequestDialog",{
    	
    	/**
		 * Event is triggered on press submit button in dialog box
		 * @public
		 */
        onSubmit: function() {
            var sPath = this.getFragment().getBindingContext().getPath();
            this.oModel.setProperty(sPath + "/Action", "R");
			CreateUpdateDialogController.prototype.onSubmit.apply(this, arguments);
        }
    });
});