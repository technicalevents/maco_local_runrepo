sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorListReportController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator",
	"sap/base/strings/formatMessage"
  ], function(MonitorListReportController, SmartTableBindingUpdate, Sorter, FilterOperator, formatMessage) {
    "use strict";
    return MonitorListReportController.extend("com.sap.cd.maco.monitor.ui.app.processuiactions.view.ProcessListReport",
      {
      	
      /**
       * Formatter Attribute.
       * @public
       */
        formatMessage: formatMessage,
        
        /******************************************************************* */
        /* LIFECYCLE METHODS */
        /******************************************************************* */

        /**
         * Lifecycle method - triggered on initialization of ProcessListReport Controller
		 * @public
         */
        onInit: function() {
			MonitorListReportController.prototype.onInit.call(this, {
				entitySet: "xMP4GxC_ProcessHeader_UI",
				actions: this.getOwnerComponent().mActions,
				routes: {
					parent: null,
					this: "listReport",
					child: null
				},
				controls: {
					table: "idProcessSmartTable",
					variantManagement: "idProcessVariantManagement",
					filterBar: "idProcessSmartFilterBar"
				},
				tableAccessControl: {
					executeMsgAggr: true,
					reportExecution: true
				},
				sizeLimit: 1500
			});
        },
        
        /******************************************************************* */
        /* PUBLIC METHODS */
        /******************************************************************* */
        
       /**
	  	* Event is triggered before data loading of smart table
        * @param {object} oEvent Table loading event
	  	* @public
		*/
        onBeforeRebindTable: function(oEvent) {
			var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter("bindingParams"));
			var aSorters = [];
			aSorters.push(new Sorter("ProcessTimestamp", true));
			aSorters.push(new Sorter("ProcessDocumentKey", true));
			oUpdate.addSorters(aSorters);
			
			// This method will add Current application state in URL
			this.storeCurrentAppState();
        },

        /**
        * Event is triggered when selection is changed in Smart Filter Bar
        * @public
        */
       onProcessFilterBarChanged: function() {
			var oFilterData = jQuery.extend(true, {}, this.getFilterBar().getFilterData());
			var aRanges = []; 
			var bIsFilterDataChanged = false;
			
			if(oFilterData.MarketPartner) {
				aRanges = oFilterData.MarketPartner.ranges;
				for(var intI = 0; intI < aRanges.length && aRanges[intI].operation === FilterOperator.EQ; intI++) {
					oFilterData.MarketPartner.ranges[intI].operation = FilterOperator.Contains;
					oFilterData.MarketPartner.ranges[intI].tokenText = "*" + aRanges[intI].tokenText.slice(1) +"*";
					bIsFilterDataChanged = true;
				}
				
				if(bIsFilterDataChanged) {
					this.getFilterBar().setFilterData(oFilterData, true);
				}
			}
      },
        
		/**
		 * Event is triggered when FilterBar is initialized. 
		 * This method will set Recently used FilterData in FilterBar
		 * @public
		 */
		onFilterBarInitialized: function() {
			this.mSingles.nav.parseNavigation().done(function(oAppState) {
				if(!jQuery.isEmptyObject(oAppState)) {
					this.getFilterBar().setDataSuiteFormat(oAppState.selectionVariant, true);
				} else {
					//To set Active/Erroneous/On Hold Status by Default
					var oDefaultStatus = {ProcessStatus: {value: null,items:[{key:"HOLD"},{key:"ERR"},{key:"ACTV"}]}};
					this.getFilterBar().setFilterData(oDefaultStatus, true);
				}
			}.bind(this));
		}
    });
});