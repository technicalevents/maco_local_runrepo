sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/base/BaseAction",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Constants"
	], function(BaseAction, Utility, Constants) {
  "use strict";

  return BaseAction.extend(
    "com.sap.cd.maco.monitor.ui.app.displaymessages.actions.CrossAppNavigationAction",
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
		 * Function is triggered on click of Download button in List Page
		 * @public
		 */
        execute: function(oParams) {
			// check params to have a context
			this.assertContextParam(oParams);
			
			return new Promise(
				function(resolve, reject) {
				
					var sLinkedDocumentNumber = oParams.event.getSource().getText();
					var sKeyField = oParams.event.getSource().data("keyField");
					var aLinkedTransferDocuments = oParams.controller.getThisModel().getProperty("/linkedTransferDocuments");
					var oLinkedTransferDocument = Utility.getObjectWithAttr(aLinkedTransferDocuments, 
												sKeyField, sLinkedDocumentNumber);
					
					if(oLinkedTransferDocument && !jQuery.isEmptyObject(oLinkedTransferDocument)) {
						var sBusinessObjectType = oLinkedTransferDocument.TecBusinessObjectType;
						var sLinkedDocumentKey = oLinkedTransferDocument.LinkDocumentKey; 
						var sProcessID = oLinkedTransferDocument.ProcessID;
						var oParam = {
							semanticObject: Utility.getSemanticObject(sBusinessObjectType),
							action: Constants.SEMANTIC_ACTION.DISPLAY,
							params: Utility.getNavigationParameters(sBusinessObjectType, sLinkedDocumentKey, sProcessID),
							appState: null
						};
						
						this.oNav.navExternal(oParam);
					}
					
					// done
					resolve({
						params: oParams
					});
					
			    }.bind(this)
		    );
        }
    }
  );
});
