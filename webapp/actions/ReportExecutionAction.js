sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/base/BaseAction",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
	"sap/m/MessageToast"
	], function(BaseAction, Constants, Utility, MessageToast) {
  "use strict";

  return BaseAction.extend(
    "com.sap.cd.maco.monitor.ui.app.displayprocesses.actions.ReportExecutionAction",
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
		 * Function is triggered on click of Execute Message Aggregation button in List Page
		 * @public
		 */
        execute: function(oParams) {
			return new Promise(
				function(resolve, reject) {
					// check params to have a context
					this.assertContextParam(oParams);
						
					var oProcessData = oParams.contexts[0].getObject();
					var sReportAction = oParams.event.getSource().data("reportAction");
					var sActionItem = (sReportAction === Constants.PROCESS_LIST_HEADER_ACTION.EXECUTE_TRANSFER_DOCUMENT) ? 
														oProcessData.CommonAccessUUID : oProcessData.ProcessDocumentNumber;
					var oData = {
						ProcessDocumentKey: oProcessData.ProcessDocumentKey,
						Action: sReportAction,
						Action_Item: sActionItem
					};
						        	
					var sKey = this.oModel.createKey("/xMP4GxC_Proc_Detail_Action_UI", 
					                                        {ProcessDocumentKey: oProcessData.ProcessDocumentKey});
					
					this.oTransaction.whenUpdated({
						path: sKey,
						data: oData,
						busyControl: oParams.busyControl
					}).then(function() {
						MessageToast.show(JSON.parse(oResponse.response.headers["sap-message"]).message);
					}.bind(this));
					
		    	}.bind(this)
		    );
        }
    }
  );
});
