sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateUpdateDialogController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/file/FileReader",
	"com/sap/cd/maco/mmt/ui/reuse/component/single/getMessage"
], function (CreateUpdateDialogController, FileReader, GetMessage) {
	"use strict";
	return CreateUpdateDialogController.extend(
		"com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.actions.CreatetChngReqActionController", {
			
		/******************************************************************* */
		/* PUBLIC METHODS */
		/******************************************************************* */
		
		/**
		 * Event is triggered to handle upload of certificates
		 * @params {object} oEvent    File upload event
		 * @public
		 */
		handleCertificateUpload: function(oEvent) {
			var oReader = new FileReader();
			var oParams = {
				file: oEvent.getParameter("files")[0],
				busyControl: this.getFragment()
			};
			
			oReader.readBase64(oParams).then(
				// resolve
				function(oParams, oResult) {
					var oContext = this.getFragment().getBindingContext();
					this.oModel.setProperty(oContext.getPath() + "/MimeType", oParams.file.type);
					this.oModel.setProperty(oContext.getPath() + "/FileContent", oResult.data);
				}.bind(this, oParams),
				// reject
				function() {
					var oContext = this.getFragment().getBindingContext();
					this.oModel.setProperty(oContext.getPath() + "/MimeType", null);
					this.oModel.setProperty(oContext.getPath() + "/FileContent", null);
				}.bind(this)
			);
		},
		
		/**
		 * Event is triggered on press submit button in dialog box
		 * @public
		 */
        onSubmit: function() {
        	this.oMessageManager.removeAllMessages();
			CreateUpdateDialogController.prototype.onSubmit.apply(this, arguments);
        },
		
		/******************************************************************* */
		/* PRIVATE METHODS */
		/******************************************************************* */

		/**
		 * Function is triggered on successfull creation of Change request details
		 * @private
		 */
		_onSubmitCreateSuccess: function (oData) {
			var aMessages = this.oMessageManager.getMessageModel().getData();
			if(!jQuery.isEmptyObject(aMessages)) {
				GetMessage(this).success({msg:aMessages[0].message});
			}
			this._fnResolve({
				data: oData
			});
			this.oControllerRegistry.get("ChangeRequest").triggerChangeRequestDataRead();
		}
	});
});