sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
	"sap/base/strings/formatMessage",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/valueHelpFormatter"
], function (ListReportNoDraftController, FormatMessage, ValueHelpFormatter) {
	"use strict";
	return ListReportNoDraftController.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.ProcessListReport", {

		/**
		 * Formatter Attribute.
		 * @public
		 */
		formatMessage: FormatMessage,
		valueHelpFormatter: ValueHelpFormatter,

		/******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * Lifecycle method - triggered on initialization of ProcessListReport Controller
		 */
		onInit: function () {
			var oComponentActions = this.getOwnerComponent().actions;
			this.getOwnerComponent().getModel().setSizeLimit(1200);

			ListReportNoDraftController.prototype.onInit.call(this, {
				entitySet: "xMP4GxCE_PARTNERS",
				actions: oComponentActions,
				routes: {
					parent: null,
					this: "listReport",
					child: "partnerPage"
				},
				controls: {
					table: "idMarketPartnersSmartTable",
					variantManagement: "idMarketPartnersVariantManagement",
					filterBar: "idMarketPartnersSmartFilterBar"
				},
				flpNavMenu: {
            		title: 'APP_TITLE'
        		},
				tableAccessControl: {}
			});
		},

		/******************************************************************* */
		/* PUBLIC METHODS 													*/
		/******************************************************************* */

		/**
		 * Event is triggered when SmartTable refresh button is pressed 
		 * This method will refresh SmartTable DAa
		 * @public
		 */
		onRefresh: function () {
			this.getSmartTable().rebindTable(true);
		}
	});
});