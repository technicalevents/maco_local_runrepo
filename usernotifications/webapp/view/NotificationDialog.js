sap.ui.define([
    "com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateUpdateDialogController"
],function(CreateUpdateDialogController) {
    "use strict";
    return CreateUpdateDialogController.extend("com.sap.cd.maco.selfservice.ui.app.usernotifications.view.NotificationDialog",{
    	
    	/**
		 * Event is triggered on press submit button in dialog box
		 * @public
		 */
        onSubmit: function() {
            var aSelectedRoles = this.byId("idRoleTable").getSelectedContexts();
            var aRoles = [];
            
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