sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Utility"
	],
	function (Utility) {
		'use strict';

		sap.ui.controller("com.sap.cd.maco.monitor.ui.app.overviewprocesses.ext.ExtController", {

			/******************************************************************* */
			/* LIFECYCLE METHODS */
			/******************************************************************* */

			/**
			 * LifeCycle Method
			 */
			onAfterRendering: function () {
				this.getView().byId("mainView--ovpMain").addStyleClass("comSapCdMacoMmtUiMonitorMsgGraphTitle");
				this.getView().byId("sapOvpShareButton").setVisible(false);
			},
			
			/**
			 * Event Handler for Filter Change
			 * @public
			 * @param {sap.ui.base.Event} oEvent Filter Change Event
			 */
			onGlobalFilterChange: function (oEvent) {
				var oFilterData = jQuery.extend(true, {}, oEvent.getSource().getFilterData());
				var oUpdatedFilterData = {};
				
				this.filterChanged = true;
				
				if(!jQuery.isEmptyObject(oFilterData)){
					oUpdatedFilterData = Utility.modifyFilterDataWithContainsOperator(oFilterData, ["MarketPartner"]);
				}
				
				if(!jQuery.isEmptyObject(oUpdatedFilterData)){
					oEvent.getSource().setFilterData(oFilterData, true);
				}

			}
		});
	});