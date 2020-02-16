sap.ui.define(
	[
		"sap/ui/model/FilterOperator",
		"com/sap/cd/maco/mmt/ui/reuse/controller/table/SmartTableController",
		"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate"
	],
	function (FilterOperator, SmartTableController, SmartTableBindingUpdate) {
		"use strict";

		return SmartTableController.extend(
			"com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.AS2Table", {
				onInit: function () {
					SmartTableController.prototype.onInit.call(this, {
						controls: {
							table: "idAS2SmartTable"
						},
						entitySet: "AS2Adapters",
						actions: {},
						tableAccessControl: {}
					});
				},

				onBeforeBindObjectPage: function (oRouteArgs) {
					this.oRouteArgs = oRouteArgs;
					this.rebindTable();
				},

				onBeforeRebindTable: function (oEvent) {
					var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter("bindingParams"));
					if (!this.oRouteArgs) {
						oUpdate.prevent();
					} else {
						this.byId("idAS2SmartTable").setTableBindingPath("/Partners('" + this.oRouteArgs.PartnerId + "')/to_ToAS2s");
					}
				}
			}
		);
	}
);