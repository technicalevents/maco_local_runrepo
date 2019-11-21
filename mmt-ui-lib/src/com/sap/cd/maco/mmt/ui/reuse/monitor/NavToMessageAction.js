sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/action/nav/NavToExternalAction",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Constants"
	], function(NavToExternalAction, Constants) {
  "use strict";

  return NavToExternalAction.extend("com.sap.cd.maco.mmt.ui.reuse.monitor.NavToMessageAction",
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
				action: "displayMessage",
				paramsMap: {
					TransferDocumentKey: sKeyField
				}
			};
			
			NavToExternalAction.call(this, oComponent, oConfig, sCardinality);
        }
    }
  );
});
