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
				debugger;
				var oContactIDControl = sap.ui.core.Fragment.byId(this.getFragmentId(), "idContact");
				var sNewOWnMktPartnerValue = oEvent.getParameter("newValue");

				if (sNewOWnMktPartnerValue) {
					oContactIDControl.getBinding("items").filter(new Filter("OwnMarketPartner", FilterOperator.EQ, sNewOWnMktPartnerValue));
				} else {
					oContactIDControl.getBinding("items").filter([]);
				}
			}
		});
});