sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/base/BaseAction",
	"sap/ui/core/util/File"
	], function(BaseAction, File) {
  "use strict";

  return BaseAction.extend(
    "com.sap.cd.maco.monitor.ui.app.displaymessages.actions.SingleDownloadAction",
    {
		/******************************************************************* */
		/* CONSTRUCTOR */
		/******************************************************************* */
		
		/**
		 * Constructor
		 */
		constructor: function(oComponent, oConfig) {
			var sCardinality = "0";
			BaseAction.call(this, oComponent, oConfig, sCardinality);
		},
		
		/******************************************************************* */
		/* PUBLIC METHODS */
		/******************************************************************* */
        
        /**
		 * Function is triggered on click of Download button in Object Page
		 * @public
		 */
        execute: function(oParams) {
			// check params to have a context
			this.assertContextParam(oParams);
			
			return new Promise(
				function(resolve, reject) {
					
				var oMessageData = oParams.contexts[0].getObject();
				var sExternalPayload = oMessageData.ExternalPayload.replace(/\n/g, "");	
				var sFileName = oMessageData.ExternalUUID;
				var oData =  new Blob([sExternalPayload]);
				var sFileExtension = "txt";
	
				File.save(oData, sFileName, sFileExtension);
				
				// done
				resolve({
					params: oParams
				});
				
		    }.bind(this));
        }
    }
  );
});
