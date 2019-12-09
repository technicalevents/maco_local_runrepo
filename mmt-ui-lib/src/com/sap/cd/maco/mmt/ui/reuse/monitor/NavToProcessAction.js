sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/action/nav/NavToExternalAction",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Constants"
	], function(NavToExternalAction, Constants) {
  "use strict";

  return NavToExternalAction.extend("com.sap.cd.maco.mmt.ui.reuse.monitor.NavToProcessAction",
    {
		/******************************************************************* */
		/* CONSTRUCTOR */
		/******************************************************************* */
		
		/**
		 * Constructor
		 */
        constructor: function(oComponent, sKeyField) {
			var sCardinality = "1";
			var oConfig = {
				semanticObject: "UtilsDataExchangeProcessing",
				action: "displayProcess",
				paramsMap: {
					ProcessDocumentKey: sKeyField,
					ProcessID: "ProcessID"
				},
				guidFields: sKeyField
			};
			
			NavToExternalAction.call(this, oComponent, oConfig, sCardinality);
        }
    }
  );
});
