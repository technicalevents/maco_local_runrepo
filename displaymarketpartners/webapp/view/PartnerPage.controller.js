sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseViewController",
	"sap/ui/core/Core"
], function (BaseViewController, Core) {
	"use strict";

	return BaseViewController.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.PartnerPage", {

		/******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * Lifecycle method - triggered on initialization of PartnerPage Controller
		 * @public
		 */
		onInit: function () {
			BaseViewController.prototype.onInit.apply(this, arguments);

			this.initViewModel();

			this.oEventBus = Core.getEventBus();
			this.oEventBus.subscribe("flexible", "showChangeRequestPage", this.showChangeRequestPage, this);
			this.oEventBus.subscribe("flexible", "hideChangeRequestPage", this.hideChangeRequestPage, this);

			this.oFlexibleColumnLayout = this.getView().byId("idPartnerPageLayout");

			this.oRouter.attachRouteMatched(this.onRouteMatched.bind(this));
		},

		/******************************************************************* */
		/* Public Methods													*/
		/******************************************************************* */

		/**
		 * Method triggered on pattern matched
		 * @public
		 */
		onRouteMatched: function () {
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);
			this.getView().byId("idPartnerDetailPage").getController().setChangeRequestVisible(true);
		},

		/**
		 * Even triggered when user presses Change Request Button to show Change Request pane
		 * @public
		 * @param {string} sChannelId Event Channel Id
		 * @param {string} sEventId Event method name
		 * @param {string} sPartnerId Current Market PartnerId
		 */
		showChangeRequestPage: function (sChannelId, sEventId, sPartnerId) {
			this.getView().byId("idChangeRequest").getController().bindView(sPartnerId);

			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.TwoColumnsBeginExpanded);

			this.getView().byId("idPartnerDetailPage").getController().setChangeRequestVisible(false);
		},

		/**
		 * Even triggered when user presses Close Change Request Panel button
		 * @public
		 */
		hideChangeRequestPage: function () {
			this.oFlexibleColumnLayout.setLayout(sap.f.LayoutType.OneColumn);

			this.getView().byId("idPartnerDetailPage").getController().setChangeRequestVisible(true);
		}

	});
});