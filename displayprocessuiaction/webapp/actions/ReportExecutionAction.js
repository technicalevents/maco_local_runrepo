sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction",
	"sap/m/MessageToast",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/Guid"
], function(BaseAction, MessageToast, Guid) {
  "use strict";

	return BaseAction.extend("com.sap.cd.maco.monitor.ui.app.displayprocessuiaction.actions.ReportExecutionAction",
    {
		/******************************************************************* */
		/* CONSTRUCTOR */
		/******************************************************************* */
		
		/**
		 * Constructor
		 */
        constructor: function(oComponent, oConfig) {
			BaseAction.call(this, oComponent, oConfig);
			this.oConfig.minContexts = 1;
			this.oConfig.maxContexts = 35;
        },
        
        /******************************************************************* */
		/* PUBLIC METHODS */
		/******************************************************************* */
        
        /**
		 * Function is triggered on click of Execute Message Aggregation button in List Page
		 * @public
		 */
        execute: function(oParams) {
			return new Promise(
				function(resolve, reject) {
					// check params to have a context
					this.assertContextParam(oParams);
					
					var aProcessDocumentKey = [];
					var sRandomGuid = Guid.generateGuid();
					
					for(var intI = 0; intI < oParams.contexts.length; intI++) {
						aProcessDocumentKey.push(oParams.contexts[intI].getProperty("ProcessDocumentKey").split("-").join("").toUpperCase());
					}
					
					var oData = {
						ProcessDocumentKey: sRandomGuid,
						MultipleKey: aProcessDocumentKey.toString(),
						Action: oParams.event.getSource().data("reportAction"),
						Action_Item: ""
					};
						        	
					var sKey = this.oModel.createKey("/xMP4GxC_Proc_Detail_Action_UI", {ProcessDocumentKey: sRandomGuid});
					
					this.oTransaction.whenUpdated({
						path: sKey,
						data: oData,
						busyControl: oParams.busyControl
					}).then(function(oResponse) {
						MessageToast.show(JSON.parse(oResponse.response.headers["sap-message"]).message);
					}.bind(this));
					
		    	}.bind(this)
		    );
        }
    }
  );
});