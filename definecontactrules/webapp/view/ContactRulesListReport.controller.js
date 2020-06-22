sap.ui.define(
	[
		"com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorListReportController",
		"com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate",
		"com/sap/cd/maco/selfservice/ui/app/definecontactrules/util/Formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Sorter",
		"sap/ui/model/json/JSONModel"
	],
	function (MonitorListReportController, SmartTableBindingUpdate, messageFormatter,
		Filter, FilterOperator, Sorter, JSONModel) {
			
		"use strict";

		return MonitorListReportController.extend(
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

					MonitorListReportController.prototype.onInit.call(this, {
						entitySet: "xMP4GxC_CTA_MP_UI",
						actions: this.getOwnerComponent().mActions,
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
						},
						sizeLimit: 1500
					});
					
					this._bindMessage();
					
					this.getView().setModel(new JSONModel({
						messageStripHidden: false
					}), "ContactRuleApp");
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
						var sMarketRoleText = messageFormatter.valueHelpFormatter.marketRole(oContext.getProperty("MarketRole"));

						return {
							key: sKey,
							text: this.oBundle.getText("OWN_MKT_PARTNER_LBL", [sKeyText, sMarketRoleText, sKey])
						};
					}.bind(this)));

					oUpdate.addSorters(aSorters);

					// This method will add Current application state in URL
					this.storeCurrentAppState();
				},
				
				/**
				 * Event is triggered when user create a default rule
				 * @public
				 * @param {object} oEvent Table loading event
				 */
				onDefaultRuleCreate: function (oEvent) {
					var oAction = this.oComponent.mActions.create;
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
				
				onOwnMarketPartnerChange: function(oEvent){
					debugger;
				},
				

				/******************************************************************* */
				/* PRIVATE METHODS */
				/******************************************************************* */

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
				}
			}
		);
	}
);