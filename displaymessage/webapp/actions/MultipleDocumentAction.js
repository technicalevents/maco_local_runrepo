sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/NavToMessageAction"
], function(BaseAction, Filter, FilterOperator, NavToMessageAction) {
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
          BaseAction.call(this, oComponent, oConfig);
          this.oConfig.minContexts = 1;
          
          this._oNavToMessageAction = new NavToMessageAction(oComponent, "LinkedDocumentKey", "ExtBusinessMessageID");
        },
        
      /******************************************************************* */
      /* PUBLIC METHODS */
      /******************************************************************* */
        
      /**
       * Function is triggered on click of Download button in List Page
       * @param {object} oParams  Parameters
       * @public
       */
        execute: function(oParams) {
          // check params to have a context
          this.assertContextParam(oParams);
          
          return new Promise(function(resolve, reject) {
			  // Store params for async usage
              this._oParams = oParams;
              
              // Create Multiple Document action sheet only once
              if (!this._oMultipeDocumentActionSheet) {
                this._oMultipeDocumentActionSheet = sap.ui.xmlfragment(
                  "com.sap.cd.maco.monitor.ui.app.displaymessages.actions.MultipleDocsActionSheet", this);
                oParams.busyControl.addDependent(this._oMultipeDocumentActionSheet);
              }
              
              this._oMultipeDocumentActionSheet.getBinding("buttons").filter();
              this._oMultipeDocumentActionSheet.getBinding("buttons").filter(
              		new Filter("SemanticType", FilterOperator.EQ, oParams.event.getSource().data("boObjectType")));
              
              this._oMultipeDocumentActionSheet.openBy(oParams.event.getSource());

              // done
              resolve({params: oParams});
		      }.bind(this));
        },
        
        /**
         * Function is triggered on click of any item in action sheet
         * @param {object} oEvent  Button press event
         * @public
         */
        onDocumentPress: function(oEvent) {
        	this._oParams.contexts = [oEvent.getSource().getBindingContext("this")];
        	this._oNavToMessageAction.execute(this._oParams);
        }
    });
});