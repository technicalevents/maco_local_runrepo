sap.ui.define([
	"sap/ui/model/FilterOperator",
	"com/sap/cd/maco/mmt/ui/reuse/controller/table/SmartTableController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/model/Sorter"
],function (FilterOperator, SmartTableController, SmartTableBindingUpdate, Sorter) {
	"use strict";

	return SmartTableController.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.detail.CertificatesTable", {
			
		/******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * Lifecycle method - triggered on initialization of CertificateTable Controller
		 */
		onInit: function () {
			SmartTableController.prototype.onInit.call(this, {
				controls: {
					table: "idCertificateSmartTable"
				},
				entitySet: "xMP4GxCE_PARTNERCERT",
				actions: {},
				tableAccessControl: {}
			});
		},

		/******************************************************************* */
		/* PUBLIC METHODS 													*/
		/******************************************************************* */
		
		/**
		 * Function triggered before binding of Object Page
		 * @param {object} oRouteArgs Router Arguments
		 */
		onBeforeBindObjectPage: function (oRouteArgs) {
			this.oRouteArgs = oRouteArgs;
			this.rebindTable();
		},
		
		/**
		 * Function triggered before Rebind of Certficate Table
		 * @param {sap.ui.base.Event} 
		 */
		onBeforeRebindTable: function (oEvent) {
			var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter("bindingParams"));
			if (!this.oRouteArgs) {
				oUpdate.prevent();
			} else {
				oUpdate.addFilter('PartnerId', FilterOperator.EQ, this.oRouteArgs.PartnerId);
    			oUpdate.endFilterAnd();
    			
    			oUpdate.addSorters([new Sorter("ValidFrom", true)]);
			}
		}
	});
});