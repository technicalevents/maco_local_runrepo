sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/base/BaseViewController",
	"com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
	"sap/ui/core/mvc/ViewType",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Utility"
], function (BaseViewController, formatter, ViewType, Utility) {
	"use strict";

	return BaseViewController.extend("com.sap.cd.maco.monitor.ui.app.displayprocesses.view.data.ProcessData", {
		formatter: formatter,
		aProcessTypesAvailable: ["DE_C_MET_MRR_MELO", "DE_C_MOSB_EOBM_MOS", "DE_C_MOSB_PCAT_MOS", "DE_C_MOSB_QUOT_MOS", "DE_C_MOSB_REQT_MOS",
			"DE_C_MET_SEND_AGGR_MSCONS", "DE_C_MOSB_AGGR_INVC_MOS", "DE_C_MOSB_AGGR_REV_INVC_MOS", "DE_C_MET_AGGR_ENERGY_VALUE"
		],
		aProcessViews: [],
		/**
		 * Lifecycle method - triggered on initialization of Process Step Controller
		 */
		onInit: function () {
			BaseViewController.prototype.onInit.apply(this, arguments);
		},

		/**
		 * Function is triggered before Binding of Object Page is completed
		 * @params {object} oRouteArgs Router Arguments object
		 */
		onBeforeBindObjectPage: function (oRouteArgs) {
			if (this.aProcessTypesAvailable.indexOf(oRouteArgs.ProcessID) > -1) {
				var sViewName = "com.sap.cd.maco.monitor.ui.app.displayprocesses.view.data.types." + oRouteArgs.ProcessID;
				var oContainer = this.getView().byId("idProcessData");
				var oProcessTypeView;
	
				this.getOwnerComponent().runAsOwner(function () {
				oContainer.removeAllItems();

					var oProcessTypeViewDet = Utility.getObjectWithAttr(this.aProcessViews, "viewName", sViewName);

					if (jQuery.isEmptyObject(oProcessTypeViewDet)) {

							oProcessTypeView = sap.ui.view({
								viewName: sViewName,
								type: ViewType.XML
							});

							this.aProcessViews.push({
								viewName: sViewName,
								oView: oProcessTypeView
							});
					} else {
						oProcessTypeView = oProcessTypeViewDet.oView;
					}

					oContainer.addItem(oProcessTypeView);

					oProcessTypeView.getController().bindView(oRouteArgs.ProcessDocumentKey);
				}.bind(this));
			}
		}

	});

});