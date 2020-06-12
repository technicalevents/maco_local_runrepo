sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction",
	"sap/ui/core/util/File",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(BaseAction, File, Filter, FilterOperator) {
	"use strict";

	return BaseAction.extend("com.sap.cd.maco.operation.ui.app.changeRequestInbox.actions.DownloadCertificateAction",
    {
		/******************************************************************* */
		/* CONSTRUCTOR */
		/******************************************************************* */
		
		/**
		 * Constructor
		 */
        constructor: function(oComponent, oConfig) {
			BaseAction.call(this, oComponent, oConfig);
        },
        
        /******************************************************************* */
		/* PUBLIC METHODS */
		/******************************************************************* */
        
        /**
		 * Function is triggered on click of Download button in List Page
		 * @public
		 */
        execute: function(oParams) {
			// check params to have a context
			this.assertContextParam(oParams);
			
			return new Promise(function(resolve, reject) {
				var oCertificateData = oParams.contexts[0].getObject();
				var sFileContentKey = this.oModel.createKey("/xMP4GxC_ChangeRequest", {db_key: oCertificateData.db_key});
				this.mSingles.transaction.whenRead({
					path: sFileContentKey,
					busyControl: oParams.busyControl,
					filters: [new Filter("BODocNo", FilterOperator.EQ, oCertificateData.BODocNo)],
					urlParameters : {
						$select: "CertificateName,MimeType,FileContent"
					}
				}).then(function(oResult){
					if (!oResult && !oResult.data) {
						return;
					}
					
					var sBinary = atob(oResult.data.FileContent);
					var aByteNumbers = new Array(sBinary.length);
					
					for(var intI = 0; intI < sBinary.length; intI++) {
						aByteNumbers[intI] = sBinary.charCodeAt(intI);
					}
					
					var aByteArray = new Uint8Array(aByteNumbers);
					// var oBlob = new Blob([aByteArray], {type: oResult.data.MimeType});
					var oBlob = new Blob([aByteArray], {type: "application/x-x509-ca-cert"});
					var sUrl = URL.createObjectURL(oBlob);
					
					// window.open(sUrl, "_self");
					
					var certificate = document.createElement("a");
					document.body.appendChild(certificate);
					certificate.href = sUrl;
					certificate.download = oResult.data.CertificateName;
					certificate.click();
					window.URL.revokeObjectURL(sUrl);
					
					// done
					resolve({params: oParams});
				}.bind(this), reject);
		    }.bind(this));
        }
    });
});