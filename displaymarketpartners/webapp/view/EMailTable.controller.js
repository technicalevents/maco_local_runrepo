sap.ui.define([
	"sap/ui/model/FilterOperator",
	"com/sap/cd/maco/mmt/ui/reuse/controller/table/SmartTableController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate"
],function (FilterOperator, SmartTableController, SmartTableBindingUpdate) {
	"use strict";

	return SmartTableController.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.EMailTable", {
			
		/******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * Lifecycle method - triggered on initialization of EmailTable Controller
		 * @public
		 */
		onInit: function () {
			SmartTableController.prototype.onInit.call(this, {
				controls: {
					table: "idEmailSmartTable"
				},
				entitySet: "xMP4GxCE_EMAILADAPTERS",
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
		 * @public
		 */
		onBeforeBindObjectPage: function (oRouteArgs) {
			this.oRouteArgs = oRouteArgs;
			this.rebindTable();
		},
			
		/**
		 * Function triggered before Rebind of Email Table
		 * @param {sap.ui.base.Event} 
		 * @public
		 */
		onBeforeRebindTable: function (oEvent) {
			var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter("bindingParams"));
			if (!this.oRouteArgs) {
				oUpdate.prevent();
			} else {
				oUpdate.addFilter('PartnerId', FilterOperator.EQ, this.oRouteArgs.PartnerId);
    			oUpdate.endFilterAnd();
			}
		}
	});
});