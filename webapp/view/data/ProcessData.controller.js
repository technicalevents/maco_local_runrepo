sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseViewController",
	"com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
	"sap/ui/core/mvc/ViewType",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
	"sap/m/Text"
], function (BaseViewController, formatter, ViewType, Utility, Text) {
	"use strict";

	return BaseViewController.extend("com.sap.cd.maco.monitor.ui.app.displayprocesses.view.data.ProcessData", {
		formatter: formatter,
		aProcessTypesAvailable: ["DE_C_MET_MRR_MELO", "DE_C_MOSB_EOBM_MOS", "DE_C_MOSB_PCAT_MOS", "DE_C_MOSB_QUOT_MOS", "DE_C_MOSB_REQT_MOS",
			"DE_C_MET_SEND_AGGR_MSCONS", "DE_C_MOSB_AGGR_INVC_MOS", "DE_C_MOSB_AGGR_REV_INVC_MOS", "DE_C_MET_AGGR_ENERGY_VALUE"
		],
		aProcessViews: [],
		oNoDataText: null,
		/**
		 * Lifecycle method - triggered on initialization of Process Step Controller
		 */
		onInit: function () {
			BaseViewController.prototype.onInit.apply(this, arguments);
			this.aProcessViews = [];
		},

		/**
		 * Function is triggered before Binding of Object Page is completed
		 * @params {object} oRouteArgs Router Arguments object
		 */
		onBeforeBindObjectPage: function (oRouteArgs) {
			var oContainer = this.getView().byId("idProcessData");
			var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
			
			oContainer.removeAllItems();
			
			if(!this.oNoDataText){
				this.oNoDataText = new Text({
					text: oResourceBundle.getText("NO_DATA_FOUND_LBL")
				})
			}
			
			if (this.aProcessTypesAvailable.indexOf(oRouteArgs.ProcessID) > -1) {
				var sViewName = "com.sap.cd.maco.monitor.ui.app.displayprocesses.view.data.types." + oRouteArgs.ProcessID;
				var oContainer = this.getView().byId("idProcessData");
				var oProcessTypeView;
	
				this.getOwnerComponent().runAsOwner(function () {
				

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
			} else {
				oContainer.addItem(this.oNoDataText);
			}
		}

	});

});