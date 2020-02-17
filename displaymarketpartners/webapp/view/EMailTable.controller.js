sap.ui.define(
	[
		"sap/ui/model/FilterOperator",
		"com/sap/cd/maco/mmt/ui/reuse/controller/table/SmartTableController",
		"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate"
	],
	function (FilterOperator, SmartTableController, SmartTableBindingUpdate) {
		"use strict";

		return SmartTableController.extend(
			"com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.EMailTable", {
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

				onBeforeBindObjectPage: function (oRouteArgs) {
					this.oRouteArgs = oRouteArgs;
					this.rebindTable();
				},

				onBeforeRebindTable: function (oEvent) {
					var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter("bindingParams"));
					if (!this.oRouteArgs) {
						oUpdate.prevent();
					} else {
						this.byId("idEmailSmartTable").setTableBindingPath("/xMP4GxCE_PARTNERS('" + this.oRouteArgs.PartnerId + "')/to_ToEmails");
					}
				}
			}
		);
	}
);