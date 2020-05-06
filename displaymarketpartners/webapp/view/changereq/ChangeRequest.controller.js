sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseViewController",
	"sap/ui/core/Core",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
], function (BaseViewController, Core, Filter, FilterOperator) {
	"use strict";

	return BaseViewController.extend(
		"com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.changereq.ChangeRequest", {

			/******************************************************************* */
			/* LIFECYCLE METHODS */
			/******************************************************************* */
			
			/**
			 * Lifecycle method - triggered on initialization of Process Step Controller
			 */
			onInit: function () {

				BaseViewController.prototype.onInit.call(this, {
					entitySet: "xMP4GxC_ChangeRequest",
					actions: this.getOwnerComponent().mActions
				});

				this.initViewModel();

				this.oEventBus = Core.getEventBus();
			},

			/******************************************************************* */
			/* Public Methods													*/
			/******************************************************************* */

			/**
			 * Event triggered on pressing Close Change Request Pane Button
			 * @public
			 */
			onCloseChangeRequetPane: function () {
				this.oEventBus.publish("flexible", "hideChangeRequestPage");
			},

			/**
			 * Method to bind startup application parameters to the View
			 * @public
			 * @param {string} sPartnerId Market PartnerId
			 */
			bindView: function (sPartnerId) {
				this.getViewModel().setProperty("/PartnerId", sPartnerId);

				this.triggerChangeRequestDataRead();
			},

			/**
			 * Method to trigger Change request Data Read
			 * @public
			 */
			triggerChangeRequestDataRead: function () {
				this._whenChangeRequestDataRead().then(this._onSucessChangeRequestDataRead.bind(this));
			},

			/******************************************************************* */
			/* Private Methods													*/
			/******************************************************************* */

			/**
			 * Function is used to trigger call to fetch Change Request Data for the selected Market Partner
			 * @private
			 * @returns {Promise} Promise object of data read call
			 */
			_whenChangeRequestDataRead: function () {
				var oFinalFilter = new Filter([new Filter("BODocNo", FilterOperator.EQ, this.getViewModel().getProperty("/PartnerId"))], false);
				return this.mSingles.transaction.whenRead({
					path: "/xMP4GxC_ChangeRequest",
					busyControl: this.getView(),
					filters: [oFinalFilter]
				});
			},

			/**
			 * Function is called when data read call is succesfull
			 * @private
			 * @param {object} oResult Change Request Data object
			 */
			_onSucessChangeRequestDataRead: function (oResult) {
				if (!oResult && !oResult.data) {
					return;
				}

				var aChangeRequestData;

				if (!oResult.data.results) {
					aChangeRequestData = [oResult.data];
				} else if (oResult && oResult.data) {
					aChangeRequestData = oResult.data.results;
				}

				this.getViewModel().setProperty("/ChangeRequestData", aChangeRequestData);
			}
		});
});