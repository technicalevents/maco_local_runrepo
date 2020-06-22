sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateUpdateDialogController",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Filter"
], function (CreateUpdateDialogController, FilterOperator, Filter) {
	"use strict";
	return CreateUpdateDialogController.extend(
		"com.sap.cd.maco.selfservice.ui.app.definecontactrules.view.ContactRulesDialogController", {

			/**
			 * Event is triggered on Change of Market Partner
			 * @param {object} oEvent Market Partner Cnange event
			 * @public
			 */
			onOwnMarketPartnerChange: function (oEvent) {
				var sNewOWnMktPartnerValue = oEvent.getParameter("newValue");

				this._filterContactIDVH(sNewOWnMktPartnerValue);
			},

			/**
			 * Event is triggered on update of Define Contact Rule
			 * @param {string} sPath Define Contact Rule update path
			 * @public
			 */
			onOpenForUpdate: function (sPath) {
				var oDefRuleObject = this.oModel.getProperty(sPath);

				this._filterContactIDVH(oDefRuleObject.OwnMarketPartner);
			},

			/**
			 * Event is triggered on create of Define Contact Rule
			 * @param {object} oProperties Define Contact Rule Properties
			 * @public
			 */
			onOpenForCreate: function (oProperties) {
				var sOwnMarketPartner;

				if (oProperties) {
					sOwnMarketPartner = oProperties.OwnMarketPartner;
				}

				this._filterContactIDVH(sOwnMarketPartner);
			},

			/**
			 * Method to filter Contact ID VH
			 * @param {string} sOwnMarketPartner Own Market Partner
			 * @private
			 */
			_filterContactIDVH: function (sOwnMarketPartner) {
				var oFilter;
				var oContactIDControl = sap.ui.core.Fragment.byId(this.getFragmentId(), "idContact");

				if (sOwnMarketPartner) {
					oFilter = new Filter("OwnMarketPartner", FilterOperator.EQ, sOwnMarketPartner);
				} else {
					oFilter = [];
				}

				oContactIDControl.getBinding("items").filter(oFilter);
			}

		});
});