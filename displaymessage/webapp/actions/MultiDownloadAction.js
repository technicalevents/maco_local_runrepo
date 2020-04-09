sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/thirdparty/jszip",
	"sap/ui/core/util/File"
	], function(BaseAction, Filter, FilterOperator, JSZip, File) {
  "use strict";

  return BaseAction.extend(
    "com.sap.cd.maco.monitor.ui.app.displaymessages.actions.MultiDownloadAction",
    {
		/******************************************************************* */
		/* CONSTRUCTOR */
		/******************************************************************* */
		
		/**
		 * Constructor
		 */
        constructor: function(oComponent, oConfig) {
			var sCardinality = "1..N";
			BaseAction.call(this, oComponent, oConfig, sCardinality);
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
			
			return new Promise(
				function(resolve, reject) {
					
				// store params for async usage
				var aContexts = oParams.contexts;
				var aExternalUUIDFilter = [];
				
				for(var intI = 0; intI < aContexts.length; intI++) {
					aExternalUUIDFilter.push(new Filter("ExternalUUID", FilterOperator.EQ, aContexts[intI].getObject().ExternalUUID));
				}
				
				var oFinalFilter = new Filter(aExternalUUIDFilter, false);
				
				this.oTransaction.whenRead({
					path: "/xMP4GxC_TransferDoc_UI",
					busyControl: oParams.busyControl,
					filters: [oFinalFilter],
					urlParameters : {
						$select: "ExternalUUID,ExternalPayload"
					}
				}).then(function(oResult){
					var aMessageListData = oResult.data.results;
					var oJSZip = new JSZip();
					
					for(var intJ = 0; intJ < aMessageListData.length; intJ++) {
						oJSZip.file(aMessageListData[intJ].ExternalUUID + ".txt", aMessageListData[intJ].ExternalPayload);
					}
					
					var oContent = oJSZip.generate({type:"blob"});
					var sFolderName = "Market Message " + new Date().toLocaleDateString();
					
					File.save(oContent, sFolderName,"zip","application/zip");
					
					// done
		            resolve({
		              params: oParams
		            });
				}.bind(this), reject);
				
		    }.bind(this));
        }
    }
  );
});
