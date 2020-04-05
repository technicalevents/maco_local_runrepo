sap.ui.define(
	[
		"com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController",
		"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
		"com/sap/cd/maco/selfservice/ui/app/definecontactrules/util/Formatter",
		"sap/ui/generic/app/navigation/service/SelectionVariant",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Sorter"
	],
	function (ListReportNoDraftController, SmartTableBindingUpdate, messageFormatter,
		SelectionVariant, Filter, FilterOperator, Sorter) {
			
		"use strict";

		return ListReportNoDraftController.extend(
			"com.sap.cd.maco.selfservice.ui.app.definecontactrules.view.ContactRulesListReport", {

				/**
				 * Formatter Attribute.
				 * @public
				 */
				formatter: messageFormatter,

				/******************************************************************* */
				/* LIFECYCLE METHODS */
				/******************************************************************* */

				/**
				 * LifeCycle method Called when ContactRulesListReport controller is instantiated.
				 * @public
				 */
				onInit: function () {
					var oComponentActions = this.getOwnerComponent().actions;

					this.getOwnerComponent().getModel().setSizeLimit(1200);

					ListReportNoDraftController.prototype.onInit.call(this, {
						entitySet: "xMP4GxC_CTA_MP_UI",
						actions: {
							create: oComponentActions.create,
							update: oComponentActions.update,
							delete: oComponentActions.delete
						},
						routes: {
							parent: null,
							this: "listReport"
						},
						controls: {
							table: "idContactRulesSmartTable",
							variantManagement: "idContactRulesVariantManagement",
							filterBar: "idContactRulesFilterBar"
						},
						tableAccessControl: {
							create: true
						}
					});

					var oRoute = this.oRouter.getRoute("initial");
					oRoute.attachPatternMatched(this._onRoutePatternMatched, this);

					this._bindMessage();
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
					var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter("bindingParams"));
					var aSorters = [];
					aSorters.push(new Sorter("OwnMarketPartner", true, function (oContext) {
						var sKey = oContext.getProperty("OwnMarketPartner");
						var sKeyText = oContext.getProperty("OwnMarketPartnerText");

						return {
							key: sKey,
							text: "Own Market Partner: " + sKey + " (" + sKeyText + ")"
						};
					}));

					oUpdate.addSorters(aSorters);

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
				 * Event is triggered when selection is changed in Own Market Partner MultiComboBox
				 * @public
				 */
				onOwnMarketPartnerChange: function () {
					var aOwnerUUIDKeys = this.getFilterBar().getControlByKey("OwnerUUID").getSelectedKeys();
					var oSmartFilterData = this.getFilterBar().getFilterData();

					delete oSmartFilterData.OwnerUUID;

					if (!jQuery.isEmptyObject(aOwnerUUIDKeys)) {
						oSmartFilterData["OwnerUUID"] = {
							"items": []
						};

						for (var intI = 0; intI < aOwnerUUIDKeys.length; intI++) {
							oSmartFilterData["OwnerUUID"].items.push({
								"key": aOwnerUUIDKeys[intI]
							});
						}
					}

					this.getFilterBar().setFilterData(oSmartFilterData, true);
				},
				
				/**
				 * Event is triggered when user create a default rule
				 * @public
				 * @param {object} oEvent Table loading event
				 */
				onDefaultRuleCreate: function (oEvent) {
					var oAction = this.oComponent.actions.create;
					var oParams = {
						busyControl: this.getView(),
						contexts: [],
						properties: {
							OwnMarketPartner: oEvent.getSource().getBindingContext().getObject().OwnMarketPartner
						},
						controller: this,
						event: oEvent
					};
					oAction.execute(oParams).then(this._bindMessage.bind(this));
				},
				
				/**
				 * Event is triggered when user updates a record
				 * @public
				 * @param {object} oEvent Table loading event
				 */
				onAfterActionUpdate: function (oResult, oParams) {
					this._bindMessage();
				},
				
				/**
				 * Event is triggered After Creation of new record
				 * @public
				 * @param {object} oEvent Table loading event
				 */
				onAfterActionCreate: function (oResult, oParams) {
					this._bindMessage();
				},
				
				/**
				 * Event is triggered After deletion of record
				 * @public
				 * @param {object} oEvent Table loading event
				 */
				onAfterActionDelete: function (oResult, oParams) {
					this._bindMessage();
				},
				
				/**
				 * Event is triggered After deletion of record
				 * @public
				 * @param {object} oEvent Table loading event
				 */
				_bindMessage: function () {
					var oMessageStripVBox = this.getView().byId('idMessageStripVBox');

					if (!this._oMessageStrip) {
						this._oMessageStrip = sap.ui.xmlfragment(this.createId("idMessageStrip"),
							"com.sap.cd.maco.selfservice.ui.app.definecontactrules.view.DefRuleMissingMStrip", this);
					}
					
					oMessageStripVBox.setBusy(true);

					oMessageStripVBox.bindAggregation('items', {
						path: '/xMP4GxC_CTA_OWNMP_NOGENRULE',
						filters: [new Filter('GenRuleDefined', FilterOperator.NE, 'X')],
						template: this._oMessageStrip,
						events: {
							change: function () {
								oMessageStripVBox.setBusy(false);
							}
						}
					});
				},

				/**
				 * Function will store application's current state on change in Contact Rule Determination
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
				 * Method is called on Route to Contact Rule Determination Page
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
			}
		);
	}
);