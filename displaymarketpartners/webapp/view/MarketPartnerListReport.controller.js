sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorListReportController",
	"sap/base/strings/formatMessage",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/valueHelpFormatter"
], function (MonitorListReportController, FormatMessage, ValueHelpFormatter) {
	"use strict";
	return MonitorListReportController.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.ProcessListReport", {

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

			MonitorListReportController.prototype.onInit.call(this, {
				entitySet: "xMP4GxCE_PARTNERS",
				actions: this.getOwnerComponent().mActions,
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
		}
	});
});