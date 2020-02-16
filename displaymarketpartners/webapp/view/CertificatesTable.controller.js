sap.ui.define(
	[
		"sap/ui/model/FilterOperator",
		"com/sap/cd/maco/mmt/ui/reuse/controller/table/SmartTableController",
		"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate"
	],
	function (FilterOperator, SmartTableController, SmartTableBindingUpdate) {
		"use strict";

		return SmartTableController.extend(
			"com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.CertificatesTable", {
				onInit: function () {
					SmartTableController.prototype.onInit.call(this, {
						controls: {
							table: "idCertificateSmartTable"
						},
						entitySet: "Certificates",
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
						this.byId("idCertificateSmartTable").setTableBindingPath("/Partners('" + this.oRouteArgs.PartnerId + "')/to_Certificates");
					}
				}
			}
		);
	}
);