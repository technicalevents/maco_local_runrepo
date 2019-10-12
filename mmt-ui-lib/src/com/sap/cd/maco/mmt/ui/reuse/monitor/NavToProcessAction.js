sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/nav/NavToExternalAction",
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
				semanticObject: Constants.SEMANCTIC_OBJECT.PROCESS_DOCUMENT,
				action: Constants.SEMANTIC_ACTION.DISPLAY,
				paramsMap: {
					ProcessDocumentKey: sKeyField,
					ProcessID: "ProcessID"
				}
			};
			
			NavToExternalAction.call(this, oComponent, oConfig, sCardinality);
        }
    }
  );
});
