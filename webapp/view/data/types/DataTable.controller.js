sap.ui.define([
	//	"com/sap/cd/maco/mmt/ui/reuse/base/BaseViewController",
	"com/sap/cd/maco/mmt/ui/reuse/table/ActionSmartTableController",
	"sap/ui/model/FilterOperator",
	"com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate"
], function (ActionSmartTableController, FilterOperator, SmartTableBindingUpdate) {
	"use strict";

	return ActionSmartTableController.extend(
		"com.sap.cd.maco.monitor.ui.app.displayprocesses.view.data.types.DataTable", {

			/**
			 * Lifecycle method - triggered on initialization of Data Table Controller
			 */
			onInit: function () {
				ActionSmartTableController.prototype.onInit.call(this, {
					entitySet: this.getView().byId("idTable").data("entityName"),
					actions: {},
					controls: {
						table: "idTable"
					}
				});
			},
			
			/**
			 * Function is used to bind entity to Table control
			 * @param {string} sProcessDocumentKey Process Document Key
			 */
			bindView: function (sProcessDocumentKey) {
				this._sProcessDocumentKey = sProcessDocumentKey;
			},

			/**
			 * Event is triggered before data loading of smart table
			 * @param {object} oEvent Table loading event
			 * @public
			 */
			onBeforeRebindTable: function (oEvent) {
				var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));
				oUpdate.addFilter("ProcessDocumentKey", FilterOperator.EQ, this._sProcessDocumentKey);
				
				oUpdate.endFilterAnd();
			}

		});

});