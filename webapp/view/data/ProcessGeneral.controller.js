sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseViewController",
	"com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
	"sap/ui/core/mvc/ViewType",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
	"sap/m/Text"
], function (BaseViewController, formatter, ViewType, Utility, Text) {
	"use strict";

	return BaseViewController.extend("com.sap.cd.maco.monitor.ui.app.displayprocesses.view.data.ProcessGeneral", {
		
		formatter: formatter,
		aProcessViews: [],
		
		/**
		 * Lifecycle method - triggered on initialization of Process Step Controller
		 */
		onInit: function () {
			BaseViewController.prototype.onInit.apply(this, arguments);
			this.aProcessViews = [];
		},
		
		onBeforeRebindTable: function(oEvent){
			var oSmartTable = oEvent.getSource();
			var sKey = this.getView()
            .getModel()
            .createKey("/xMP4GxC_General_Inbound_Info", {
              iv_processid: this.sProcessId
            });
			oSmartTable.setTableBindingPath(sKey + "/Set");
		},

		/**
		 * Function is triggered before Binding of Object Page is completed
		 * @params {object} oRouteArgs Router Arguments object
		 */
		onBeforeBindObjectPage: function (oRouteArgs) {
			this.sProcessId = oRouteArgs.ProcessID;
			
			
		}

	});

});