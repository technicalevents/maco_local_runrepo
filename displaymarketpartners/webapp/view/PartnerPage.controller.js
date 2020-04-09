sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/objectPage/ObjectPageNoDraftController",
	"sap/base/strings/formatMessage",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/valueHelpFormatter"
],function (ObjectPageNoDraftController, FormatMessage, ValueHelpFormatter) {
	"use strict";

	return ObjectPageNoDraftController.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.PartnerPage", {
			
		formatMessage: FormatMessage,
		valueHelpFormatter: ValueHelpFormatter,
		
		
		/******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */
		
		/**
		 * Lifecycle method - triggered on initialization of PartnerPage Controller
		 * @public
		 */
		onInit: function () {
			var oPartnerActions = this.getOwnerComponent().actions.partner;
			ObjectPageNoDraftController.prototype.onInit.call(this, {
				entitySet: "xMP4GxCE_PARTNERS",
				i18n: {
					notFoundMsg: this.notFoundMsg.bind(this)
				},
				controls: {
					objectPage: "objectPage"
				},
				routes: {
					this: "partnerPage",
					parent: "listReport"
				},
				actions: {}
			});
		},
		
		/******************************************************************* */
		/* Public Methods													*/
		/******************************************************************* */

		/**
		 * Function returns no found message in case of some errors
		 * @public
		 * @param {object} 
		 * @returns {string} No found message
		 */
		notFoundMsg: function (oRouteArgs) {
			return this.oBundle.getText("partnerNotFound", [oRouteArgs.Pid, oRouteArgs.UUID]);
		}
	});
});