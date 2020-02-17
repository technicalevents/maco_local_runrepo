sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
	"sap/ui/generic/app/navigation/service/SelectionVariant",
	"sap/base/strings/formatMessage"
], function (ListReportNoDraftController, SmartTableBindingUpdate, SelectionVariant, formatMessage) {
	"use strict";
	return ListReportNoDraftController.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.ProcessListReport", {

		/**
		 * Formatter Attribute.
		 * @public
		 */
		formatMessage: formatMessage,

		/******************************************************************* */
		/* LIFECYCLE METHODS */
		/******************************************************************* */

		/**
		 * Lifecycle method - triggered on initialization of ProcessListReport Controller
		 */
		onInit: function () {
			var oComponentActions = this.getOwnerComponent().actions;
			this.getOwnerComponent().getModel().setSizeLimit(1200);

			ListReportNoDraftController.prototype.onInit.call(this, {
				entitySet: "xMP4GxCE_PARTNERS",
				actions: {
					navToPartnerPage: oComponentActions.navToPartnerPage,
					share: oComponentActions.share
				},
				routes: {
					parent: null,
					this: "listReport",
					child: "partnerPage"
				},
				controls: {
					table: "idMarketPartnersSmartTable",
					variantManagement: "idMarketPartnersVariantManagement",
					filterBar: "idMarketPartnersSmartFilterBar"
				},
				tableAccessControl: {
					navToPartnerPage: true
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
			this.oNav.parseNavigation().done(function (oAppState) {
				if (!jQuery.isEmptyObject(oAppState)) {
					this.getFilterBar().setDataSuiteFormat(oAppState.selectionVariant, true);
					this.getSmartTable().rebindTable(true);
				}
			}.bind(this));
		},

		/**
		 * Event is triggered when SmartTable refresh button is pressed 
		 * This method will refresh SmartTable DAa
		 * @public
		 */
		onRefresh: function () {
			this.getSmartTable().rebindTable(true);
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

			this.oNav.storeInnerAppState(oCurrentAppState);
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