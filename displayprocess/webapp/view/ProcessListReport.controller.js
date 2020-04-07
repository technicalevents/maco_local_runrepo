sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/ui/model/Sorter",
	"sap/ui/model/FilterOperator"
], function (ListReportNoDraftController, SmartTableBindingUpdate, Formatter,
	SelectionVariant, Sorter, FilterOperator) {
	"use strict";

	return ListReportNoDraftController.extend("com.sap.cd.maco.monitor.ui.app.displayprocesses.view.ProcessListReport", {

		/**
		 * Formatter Attribute.
		 * @public
		 */
		formatter: Formatter,

		/******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * Lifecycle method - triggered on initialization of ProcessListReport Controller
		 */
		onInit: function() {
			this.getOwnerComponent().getModel().setSizeLimit(1200);
	
			ListReportNoDraftController.prototype.onInit.call(this, {
				entitySet: "xMP4GxC_ProcessHeader_UI",
				actions: this.getOwnerComponent().mActions,
				routes: {
					parent: null,
					this: "listReport",
					child: "processPage"
				},
				controls: {
					table: "idProcessSmartTable",
					variantManagement: "idProcessVariantManagement",
					filterBar: "idProcessSmartFilterBar"
				},
				tableAccessControl: {
					navToProcessPage: true
				}
			});

			this.oRouter.getRoute("initial").attachPatternMatched(this._onRoutePatternMatched, this);
		},

		/******************************************************************* */
		/* PUBLIC METHODS */
		/******************************************************************* */

		/**
		 * Event is triggered before data loading of smart table
		 * @param {object} oEvent Table loading event
		 * @public
		 */
		onBeforeRebindTable: function(oEvent) {
			var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));
			var aSorters = [];
			aSorters.push(new Sorter("ProcessTimestamp", true));
			aSorters.push(new Sorter("ProcessDocumentKey", true));
			oUpdate.addSorters(aSorters);

			// This method will add Current application state in URL
			this.storeCurrentAppState();
		},

		/**
		 * Event is triggered before export of Records 
		 * @param {object} oEvent Table Export event
		 * @public
		 */
		onBeforeExport: function(oEvent) {
			var iCount = oEvent.getParameter("exportSettings").dataSource.count;

			if(iCount > 10000) {
				oEvent.getParameter("exportSettings").dataSource.count = 10000;
				this.mSingles.message.info({
					msgKey: "EXCEL_DOWNLOAD_INFO_MSG"
				});
			}
		},

		/**
		 * Event is triggered when selection is changed in Smart Filter Bar
		 * @public
		 */
		onProcessFilterBarChanged: function() {
			var oFilterData = jQuery.extend(true, {}, this.getFilterBar().getFilterData());
			var aRanges = [];
			var bIsFilterDataChanged = false;

			if(oFilterData.MarketPartner) {
				aRanges = oFilterData.MarketPartner.ranges;
				for(var intI = 0; intI < aRanges.length && aRanges[intI].operation === FilterOperator.EQ; intI++) {
					oFilterData.MarketPartner.ranges[intI].operation = FilterOperator.Contains;
					oFilterData.MarketPartner.ranges[intI].tokenText = "*" + aRanges[intI].tokenText.slice(1) + "*";
					bIsFilterDataChanged = true;
				}

				if(bIsFilterDataChanged) {
					this.getFilterBar().setFilterData(oFilterData, true);
				}
			}
		},

		/**
		 * Event is triggered when selection is changed in Own Market Partner MultiComboBox
		 * @public
		 */
		onOwnMarketPartnerChange: function() {
			var aOwnerUUIDKeys = this.getFilterBar().getControlByKey("OwnerUUID").getSelectedKeys();
			var oSmartFilterData = this.getFilterBar().getFilterData();

			delete oSmartFilterData.OwnerUUID;

			if(!jQuery.isEmptyObject(aOwnerUUIDKeys)) {
				oSmartFilterData["OwnerUUID"] = {
					"items": []
				};

				for(var intI = 0; intI < aOwnerUUIDKeys.length; intI++) {
					oSmartFilterData["OwnerUUID"].items.push({
						"key": aOwnerUUIDKeys[intI]
					});
				}
			}

			this.getFilterBar().setFilterData(oSmartFilterData, true);
		},

		/**
		 * Event is triggered when FilterBar is initialized. 
		 * This method will set Recently used FilterData in FilterBar
		 * @public
		 */
		onFilterBarInitialized: function() {
			this.mSingles.nav.parseNavigation().done(function (oAppState) {
				if (!jQuery.isEmptyObject(oAppState)) {
					this.getFilterBar().setDataSuiteFormat(oAppState.selectionVariant, true);
					this.getSmartTable().rebindTable(true);
				}
			}.bind(this));
		},
		
		/**
		 * Function will store application's current state on change in message list
		 * @public
		 */
		storeCurrentAppState: function() {
			var oSmartFilterUiState = this.getFilterBar().getUiState();
			var oSelectionVariant = new SelectionVariant(JSON.stringify(oSmartFilterUiState.getSelectionVariant()));
			var oCurrentAppState = {
				selectionVariant: oSelectionVariant.toJSONString(),
				tableVariantId: this.getSmartTable().getCurrentVariantId(),
				valueTexts: oSmartFilterUiState.getValueTexts()
			};

			this.mSingles.nav.storeInnerAppState(oCurrentAppState);
		},

		/******************************************************************* */
		/* PRIVATE METHODS */
		/******************************************************************* */

		/**
		 * Method is called on Route to Message List Page
		 * @private
		 */
		_onRoutePatternMatched: function() {
			this.oComponent.getService("ShellUIService").then(
				function(oService) {
					oService.setHierarchy([]);
				}.bind(this),
				function(oError) {
					jQuery.sap.log.error("Cannot get ShellUIService", oError);
				}
			);
		}
	});
});