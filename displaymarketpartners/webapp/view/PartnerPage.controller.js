sap.ui.define([
		"com/sap/cd/maco/mmt/ui/reuse/controller/objectPage/ObjectPageNoDraftController",
		"sap/base/strings/formatMessage"
	],
	function (ObjectPageNoDraftController, FormatMessage) {
		"use strict";

		return ObjectPageNoDraftController.extend(
			"com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.PartnerPage", {
				
				formatMessage: FormatMessage,
				
				/**
        		 * Lifecycle method - triggered on initialization of PartnerPage Controller
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
				
				/**
        		 * Function returns no found message in case of some errors
        		 * @public
        		 * @param {object} 
        		 * @returns {string} No found message
        		 */
				notFoundMsg: function (oRouteArgs) {
					return this.oBundle.getText("partnerNotFound", [oRouteArgs.Pid, oRouteArgs.UUID]);
				}
			}
		);
	});