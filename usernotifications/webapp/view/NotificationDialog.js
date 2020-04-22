sap.ui.define([
    "com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateUpdateDialogController",
    "sap/m/MessageToast"
],function(CreateUpdateDialogController, MessageToast) {
    "use strict";
    return CreateUpdateDialogController.extend("com.sap.cd.maco.selfservice.ui.app.usernotifications.view.NotificationDialog",{
    	
    	/**
		 * Event is triggered on opening create notification dialog box
		 * @public
		 */
		onOpenForCreate: function() {
			this.byId("idRoleTable").removeSelections(true);
		},
    	
    	/**
		 * Event is triggered on press submit button in dialog box
		 * @public
		 */
        onSubmit: function() {
            var aSelectedRoles = this.byId("idRoleTable").getSelectedContexts();
            var aRoles = [];
            
            if(jQuery.isEmptyObject(aSelectedRoles)) {
				MessageToast.show(this.oBundle.getText("SELECT_ROLE_MSG"));
				return;
			}
            
			for(var intI = 0; intI < aSelectedRoles.length; intI++) {
				aRoles.push(aSelectedRoles[intI].getObject("Role"));
			}
			
			var sRoles = aRoles.join(",");
			var sPath = this.getFragment().getBindingContext().getPath();
            
            this.oModel.setProperty(sPath + "/Roles", sRoles);
			CreateUpdateDialogController.prototype.onSubmit.apply(this, arguments);
        }
    });
});