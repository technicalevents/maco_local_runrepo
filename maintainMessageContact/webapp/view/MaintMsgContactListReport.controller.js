sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/model/Sorter",
	"sap/base/strings/formatMessage",
	// "sap/ui/model/Filter",
	// "sap/ui/model/FilterOperator",
	// "sap/base/security/encodeURL",
	// "sap/ui/core/CalendarType",
	// "sap/ui/core/format/DateFormat"
  ], function(ListReportNoDraftController, SmartTableBindingUpdate, Sorter, formatMessage,
			Filter, FilterOperator, encodeURL, CalendarType, DateFormat) {
    "use strict";
    return ListReportNoDraftController.extend("com.sap.cd.maco.monitor.ui.app.maintmsgcontacts.view.MaintMsgContactListReport",
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
         * Lifecycle method - triggered on initialization of MassMeterReadingListReport Controller
		 * @public
         */
        onInit: function() {
			// var oComponentActions = this.getOwnerComponent().actions;
			
			ListReportNoDraftController.prototype.onInit.call(this, {
				entitySet: "xMP4GxC_MassProcMtrRead",
				actions: {
					// navToUploadProcessAction: oComponentActions.navToUploadProcessAction,
					// navToAggrProcessAction: oComponentActions.navToAggrProcessAction,
					// navToMessageAction: oComponentActions.navToMessageAction,
					// share: oComponentActions.share
				},
				routes: {
					parent: null,
					this: "listReport",
					child: null
				},
				controls: {
					table: "idMaintMsgContactSmartTable",
					variantManagement: "idMaintMsgContactVariantManagement",
					filterBar: "idMaintMsgContactSmartFilterBar"
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
			var aSorters = [new Sorter("PeriodFromDate", true), new Sorter("PeriodToDate", true)];
			
			oUpdate.addSorters(aSorters);
		},

		/**
	  	* Event is triggered before smart variant is fetched
	  	* @public
		*/
        onBeforeMassMeterReadVariantFetch: function() {
        	// var oFilterData = this.getFilterBar().getFilterData();
			// var sSelMassMeterReadType = this.byId("idMassMeterReadSegmentedButton").getSelectedKey();
			
			// oFilterData._CUSTOM = {
			// 	MeterReadType: (sSelMassMeterReadType && sSelMassMeterReadType !== "") ? sSelMassMeterReadType : "ALL"
			// };
			
			// this.getFilterBar().setFilterData(oFilterData);
        },
        
        /**
	  	* Event is triggered after smart variant is loaded
	  	* @public
		*/
        onAfterMassMeterReadVariantLoad: function() {
			// var oFilterData = this.getFilterBar().getFilterData();
			// var sSelMassMeterReadType;
			
			// if(oFilterData._CUSTOM) {
			// 	sSelMassMeterReadType = oFilterData._CUSTOM.MeterReadType
			// }

			// this.byId("idMassMeterReadSegmentedButton").setSelectedKey(sSelMassMeterReadType || "ALL");
        },
        
        /**
		 * Event is triggered before export of Records 
		 * @param {object} oEvent Table Export event
		 * @public
		 */
		onBeforeExport: function (oEvent) {
			var iCount = oEvent.getParameter("exportSettings").dataSource.count;
			if (iCount > 500) {
				oEvent.getParameter("exportSettings").dataSource.count = 500;
				this.oMessage.info({
					msgKey: "EXCEL_DOWNLOAD_INFO_MSG"
				});
			}
		}
    });
});