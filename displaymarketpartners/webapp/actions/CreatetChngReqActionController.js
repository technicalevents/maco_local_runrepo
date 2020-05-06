sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateUpdateDialogController",
	"sap/m/MessageBox"
], function (CreateUpdateDialogController, MessageBox) {
	"use strict";
	return CreateUpdateDialogController.extend(
		"com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.actions.CreatetChngReqActionController", {

			/**
			 * Function is triggered on successfull creation of Change request details
			 * @public
			 */
			_onSubmitCreateSuccess: function (oData) {
				CreateUpdateDialogController.prototype._onSubmitCreateSuccess.apply(this, arguments);

				this.oControllerRegistry.get("ChangeRequest").triggerChangeRequestDataRead();
				debugger;
			}
		});
});