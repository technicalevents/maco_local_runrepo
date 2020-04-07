sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseViewController"
], function (BaseViewController) {
	"use strict";

	return BaseViewController.extend("com.sap.cd.maco.monitor.ui.app.displayprocesses.view.data.types.DataForm", {

		/**
		 * Lifecycle method - triggered on initialization of Data Form Controller
		 */
		onInit: function () {
			BaseViewController.prototype.onInit.apply(this, arguments);
		},
		
		/**
		 * Function is used to bind entity to Simple form control
		 * @param {string} sProcessDocumentKey Process Document Key
		 */
		bindView: function(sProcessDocumentKey){
			var oFormControl = this.getView().byId("idForm");
			var sEntityName = oFormControl.data("entityName");
			var sKey = this.getView().getModel().createKey("/" + sEntityName, {
				ProcessDocumentKey: sProcessDocumentKey,
				IsGeneral: false
			});
			
			oFormControl.bindElement(sKey);
		}
	});
});