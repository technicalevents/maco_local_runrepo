sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorListReportController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter"
], function (MonitorListReportController, SmartTableBindingUpdate, FilterOperator, Sorter) {
	"use strict";
	return MonitorListReportController.extend("com.sap.cd.maco.operation.ui.app.changeRequestInbox.view.ChangeRequestListReport", {

		/******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * Lifecycle method - triggered on initialization of ProcessListReport Controller
		 * @public
		 */
		onInit: function () {
			MonitorListReportController.prototype.onInit.call(this, {
				entitySet: "xMP4GxC_ChangeRequest",
				actions: this.getOwnerComponent().mActions,
				routes: {
					parent: null,
					this: "listReport",
					child: null
				},
				controls: {
					table: "idChangeRequestSmartTable",
					variantManagement: "idChangeRequestVariantManagement",
					filterBar: "idChangeRequestSmartFilterBar"
				},
				flpNavMenu: {
					title: "APP_TITLE"
				}
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
			var aSorters = [new Sorter("ChangeDateTemp", true), new Sorter("CreateDate", true)];
			var sSelChangeReqType = this.byId("idChangeRequestSegmentedButton").getSelectedKey();
			this.getViewModel().setProperty("/ChangeRequestType", sSelChangeReqType);
			
			oUpdate.addSorters(aSorters);
			oUpdate.addFilter("ChangeRequestType", FilterOperator.EQ, sSelChangeReqType); 
			oUpdate.endFilterAnd();
			
			// This method will add Current application state in URL
			this.storeCurrentAppState();
		},
		
		/**
         * Event is triggered when Change Request Type Segmented Button selection is changed
         * @params {object} oEvent  Segmented button selection change event
         * @public
         */
		onChangeReqTypeSelChange: function(oEvent) {
			this.getSmartTable().rebindTable(true);
		},
		
		/**
	  	* Event is triggered before smart variant is fetched
	  	* @public
		*/
        onBeforeChangeRequestVariantFetch: function() {
        	var oFilterData = this.getFilterBar().getFilterData();
			var sSelChangeRequestType = this.byId("idChangeRequestSegmentedButton").getSelectedKey();
			
			oFilterData._CUSTOM = {
				ChangeRequestType: (sSelChangeRequestType && sSelChangeRequestType !== "") ? sSelChangeRequestType : "EMAIL"
			};
			
			this.getFilterBar().setFilterData(oFilterData);
        },
        
        /**
	  	* Event is triggered after smart variant is loaded
	  	* @public
		*/
        onAfterChangeRequestVariantLoad: function() {
			var oFilterData = this.getFilterBar().getFilterData();
			var sSelChangeRequestType;
			
			if(oFilterData._CUSTOM) {
				sSelChangeRequestType = oFilterData._CUSTOM.ChangeRequestType
			}
			
			this.byId("idChangeRequestSegmentedButton").setSelectedKey(sSelChangeRequestType || "EMAIL");
        },
	});
});