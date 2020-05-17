sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/objectPage/ObjectPageNoDraftController",
	"sap/base/strings/formatMessage",
	"sap/ui/core/Core",
	"com/sap/cd/maco/mmt/ui/reuse/formatter/criticality",
], function (ObjectPageNoDraftController, FormatMessage, Core, CriticalityFormatter) {
	"use strict";

	return ObjectPageNoDraftController.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.detail.PartnerDetailPage", {

		formatMessage: FormatMessage,
		criticalityFormatter: CriticalityFormatter,

		/******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * Lifecycle method - triggered on initialization of PartnerDetailPage Controller
		 * @public
		 */
		onInit: function () {
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
				actions: {},
				flpNavMenu: {
					title: 'PARTNER_SINGULAR_LBL',
					parentTitle: 'APP_TITLE',
					parentIntent: '#UtilsDataExchangeProcessing-displayMarketPartner'
				}
			});

			this.oEventBus = Core.getEventBus();
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
			return this.oBundle.getText("partnerNotFound", [oRouteArgs.PartnerId]);
		},

		/**
		 * Method will be triggered once object page binding is done with entitySet
		 * @param {object} oRouteParams        Route Parameters
		 * @public
		 */
		onAfterBind: function (oRouteParams) {
			this.getViewModel().setProperty("/PartnerId", oRouteParams.PartnerId);
		},
		
		/**
		 * Even triggered when user presses Change Request Button to show Change Request pane
		 * @public
		 */
		onChangeRequestPress: function () {
			this.oEventBus.publish("flexible", "showChangeRequestPage", this.getViewModel().getProperty("/PartnerId"));
		},
		
		/**
		 * Method to handle Change Request Button Visibility
		 * @public
		 * @param {boolean} bChangeReqButtonVisible true/false for showing/hiding change request button
		 */
		setChangeRequestVisible: function (bChangeReqButtonVisible) {
			this.getViewModel().setProperty("/ChangeReqVisible", bChangeReqButtonVisible);
		}
	});
});