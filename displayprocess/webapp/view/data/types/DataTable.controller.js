sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/table/SmartTableController",
	"sap/ui/model/FilterOperator",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate"
], function (SmartTableController, FilterOperator, SmartTableBindingUpdate) {
	"use strict";

	return SmartTableController.extend(
		"com.sap.cd.maco.monitor.ui.app.displayprocesses.view.data.types.DataTable", {

			aProcessTypesForGenInbInfo: ["DE_C_CP_ADV_RECV"],
			aVisibilityHandler: ["Device"],
			/**
			 * Lifecycle method - triggered on initialization of Data Table Controller
			 */
			onInit: function () {
				SmartTableController.prototype.onInit.call(this, {
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
			bindView: function (sProcessDocumentKey, sProcessId) {
				this._sProcessDocumentKey = sProcessDocumentKey;
				this._sProcessId = sProcessId;

				this.getView().byId("idTable").rebindTable();
				if (this.aProcessTypesForGenInbInfo.indexOf(this._sProcessId) >= 0) {
					this.getView().byId("idGeneralDataTable").rebindTable();
				}
			},

			/**
			 * Event is triggered before data loading of smart table
			 * @param {object} oEvent Table loading event
			 * @public
			 */
			onBeforeRebindTable: function (oEvent) {
				var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));
				oUpdate.addFilter("ProcessDocumentKey", FilterOperator.EQ, this._sProcessDocumentKey);
				oUpdate.addFilter("IsGeneral", FilterOperator.EQ, false);
				oUpdate.endFilterAnd();
			},

			/**
			 * Event is triggered before data loading of General Inbound Information Section smart table
			 * @param {object} oEvent Table loading event
			 * @public
			 */
			onBeforeRebindGenInfoTable: function (oEvent) {
				var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter("bindingParams"));
				oUpdate.addFilter("ProcessDocumentKey", FilterOperator.EQ, this._sProcessDocumentKey);
				oUpdate.addFilter("IsGeneral", FilterOperator.EQ, true);

				oUpdate.endFilterAnd();
			},
			
			/**
			 * Event is triggered on data received in Table
			 * @param {object} oResponseData Data Received Table event object
			 * @public
			 */
			onTableDataReceived: function (oResponseData) {
				var oAdditionalData = oResponseData.getParameter("mParameters").data;
				var oVisiblilityObj = {};
				
				if (oAdditionalData && oAdditionalData.__count) {
					var oResult = oAdditionalData.results[0];
					
					this.aVisibilityHandler.forEach(function(sProperty){
						oVisiblilityObj["is" + sProperty + "Visible"] = !!oResult[sProperty];
					}.bind(this));
					this.getViewModel().setProperty("/", oVisiblilityObj);
				}
			}
		});
});