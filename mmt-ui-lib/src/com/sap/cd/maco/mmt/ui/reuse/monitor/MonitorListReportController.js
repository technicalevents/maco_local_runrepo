sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
	"sap/ui/generic/app/navigation/service/SelectionVariant"
],function (ListReportNoDraftController, SelectionVariant) {
	"use strict";
	return ListReportNoDraftController.extend("com.sap.cd.maco.mmt.ui.reuse.monitor.MonitorListReportController", {
		
		/******************************************************************* */
        /* LIFECYCLE METHODS */
        /******************************************************************* */

        /**
         * Lifecycle method - triggered on initialization of MonitorListReport Controller
         * @public
         */
		onInit: function(){
			ListReportNoDraftController.prototype.onInit.apply(this, arguments);
			
			if(arguments[0].sizeLimit) {
				this.getOwnerComponent().getModel().setSizeLimit(arguments[0].sizeLimit);
			}
			
			var oRoute = this.oRouter.getRoute("initial");
			oRoute.attachPatternMatched(this._onRoutePatternMatched, this);
		},
		
		/******************************************************************* */
		/* PUBLIC METHODS */
		/******************************************************************* */
		
		/**
		 * Event is triggered before data loading of smart table
		 * @param {object} oEvent Table loading event
		 * @public
		 */
		onBeforeRebindTable: function (oEvent) {
			// This method will add Current application state in URL
			this.storeCurrentAppState();
		},

		/**
		 * Event is triggered when FilterBar is initialized. 
		 * This method will set Recently used FilterData in FilterBar
		 * @public
		 */
		onFilterBarInitialized: function () {
			this.mSingles.nav.parseNavigation().done(function (oAppState) {
				if (!jQuery.isEmptyObject(oAppState)) {
					this.getFilterBar().setDataSuiteFormat(oAppState.selectionVariant, true);
					this.getSmartTable().rebindTable(true);
				}
			}.bind(this));
		},

		/**
		 * Event is triggered when SmartTable refresh button is pressed 
		 * This method will refresh SmartTable Data
		 * @public
		 */
		onRefresh: function () {
			this.getSmartTable().rebindTable(true);
		},

		/**
		 * Event is triggered when selection is changed in Own Market Partner MultiComboBox
		 * @public
		 */
		onCustomControlChange: function (sControlKey) {
			var aControlKeys = this.getFilterBar().getControlByKey(sControlKey).getSelectedKeys();
			var oSmartFilterData = this.getFilterBar().getFilterData();

			delete oSmartFilterData[sControlKey];

			if (!jQuery.isEmptyObject(aControlKeys)) {
				oSmartFilterData[sControlKey] = {
					"items": []
				};

				for (var intI = 0; intI < aControlKeys.length; intI++) {
					oSmartFilterData[sControlKey].items.push({
						"key": aControlKeys[intI]
					});
				}
			}

			this.getFilterBar().setFilterData(oSmartFilterData, true);
		},

		/**
		 * Event is triggered before export of Records 
		 * @param {object} oEvent Table Export event
		 * @public
		 */
		onBeforeExport: function (oEvent, iAllowedRowsToExport) {
			var iCount = oEvent.getParameter("exportSettings").dataSource.count;

			if (iCount > iAllowedRowsToExport) {
				oEvent.getParameter("exportSettings").dataSource.count = iAllowedRowsToExport;
				this.mSingles.message.info({
					msgKey: "EXCEL_DOWNLOAD_INFO_MSG"
				});
			}
		},

		/**
		 * Function will store application's current state on change in message list
		 * @public
		 */
		storeCurrentAppState: function () {
			var oSmartFilterUiState = this.getFilterBar().getUiState();
			var oSelectionVariant = new SelectionVariant(JSON.stringify(oSmartFilterUiState.getSelectionVariant()));
			var oCurrentAppState = {
				selectionVariant: oSelectionVariant.toJSONString(),
				tableVariantId: this.getSmartTable().getCurrentVariantId(),
				valueTexts: oSmartFilterUiState.getValueTexts()
			};
			this.mSingles.nav.storeInnerAppState(oCurrentAppState);
		},
		
		/**
  		 * Event is triggered after smart variant is loaded
  		 * @public
		 */
		onAfterVariantLoad: function() {
			var oFilterData = this.getFilterBar().getFilterData();
			var aOwnMarketPartnerKeys = [];

			if(oFilterData.OwnMarketPartner && jQuery.isArray(oFilterData.OwnMarketPartner.items)) {
				var aOwnMarketPartnerItems = oFilterData.OwnMarketPartner.items;
				for(var intI = 0; intI < aOwnMarketPartnerItems.length; intI++) {
					aOwnMarketPartnerKeys.push(aOwnMarketPartnerItems[intI].key);
				}
			}

			this.byId("idOwnMarketPartner").setSelectedKeys(aOwnMarketPartnerKeys);
		},

		/******************************************************************* */
		/* PRIVATE METHODS */
		/******************************************************************* */

		/**
		 * Method is called on Route to Message List Page
		 * @private
		 */
		_onRoutePatternMatched: function () {
			this.oComponent.getService("ShellUIService").then(
				function (oService) {
					oService.setHierarchy([]);
				}.bind(this),
				function (oError) {
					jQuery.sap.log.error("Cannot get ShellUIService", oError);
				}
			);
		}
	});
});