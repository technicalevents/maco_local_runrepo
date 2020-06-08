sap.ui.define([
 "com/sap/cd/maco/mmt/ui/reuse/monitor/ExtControllerUtility"
	],
	function (ExtControllerUtility) {
		'use strict';

		sap.ui.controller(
			'com.sap.cd.maco.monitor.ui.app.overviewmessages.ext.ExtController', {


				/******************************************************************* */
				/* LIFECYCLE METHODS */
				/******************************************************************* */

				/**
				 * LifeCycle Method which is tringered on Rendering of the Application
				 */
				onAfterRendering: function () {
					this.getView().byId("mainView--ovpMain").addStyleClass("comSapCdMacoMmtUiMonitorMsgGraphTitle");
					this.getView().byId("sapOvpShareButton").setVisible(false);
				},
				
				
				
				
				/**
				 * Event Method:- Triggered on Click on Chart Section for Navigating to Market Message Monitor Application
				 * @public
				 * @param {string} sCustomParamMethodName method name to fetch custom navigation parameters
				 */
				onCustomParams: function (sCardName) {
					if (sCustomParamMethodName === "OverallOutboundDeliveryStatus") {
						return this._getCustomParamOverallOutDelStatus.bind(this);
					} else if (sCustomParamMethodName === "OverallInboundMessageProcessStatus") {
						return this._getCustomParamOverallInbDelStatus.bind(this);
					} else if (sCustomParamMethodName === "InboundAperakMoni") {
						return this._getCustomParamInbAperakMoni.bind(this);
					} else if (sCustomParamMethodName === "OutboundAperakMoni") {
						return this._getCustomParamOutAperakMoni.bind(this);
					}
				},
				
				/**
				 * Method called when user Click on Chart Section on OverallOutDelStatus Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamOverallOutDelStatus: function (oNavigateParams, oSelectionVariantParams) {
					var sCombinedStatusKey = "APERAK_POSITIVE_CONTRL_RECEIVED_LBL";
					var aIndividualStatusKey = ["APERAK_RECEIVED_STATUS_LBL", "POSITIVE_CONTRL_RECEIVED_STATUS_LBL"];
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

					var aAdditionalFilters = [{
						property: "Direction",
						value: "O"
					}];

					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, aAdditionalFilters);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, aAdditionalFilters, sCombinedStatusKey, aIndividualStatusKey, "TDStatus", oResourceBundle);
				},
				
				/**
				 * Method called when user Click on Chart Section on OverallInboundDelStatus Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamOverallInbDelStatus: function (oNavigateParams, oSelectionVariantParams) {
					var sCombinedStatusKey = "APERAK_POSITIVE_CONTRL_SENT_LBL";
					var aIndividualStatusKey = ["APERAK_SENT_STATUS_LBL", "POSITIVE_CONTRL_SENT_STATUS_LBL"];
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();


					var aAdditionalFilters = [{
						property: "Direction",
						value: "I"
					}];
					
					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, aAdditionalFilters);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, aAdditionalFilters, sCombinedStatusKey, aIndividualStatusKey, "TDStatus", oResourceBundle);
				},
				
				/**
				 * Method called when user Click on Chart Section on InboundAperakMoni Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamInbAperakMoni: function (oNavigateParams, oSelectionVariantParams) {
					var sCombinedStatusKey = "NON_APERAK_LBL";
					var aIndividualStatusKey = ["POSITIVE_CONTRL_RECEIVED_STATUS_LBL", "NEGATIVE_CONTRL_RECEIVED_STATUS_LBL",
						"SENT_WAIT_ACK_STATUS_LBL", "NEW_STATUS_LBL"
					];

					var aAdditionalFilters = [{
						property: "Direction",
						value: "I"
					}];
					
					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, aAdditionalFilters);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, aAdditionalFilters, sCombinedStatusKey, aIndividualStatusKey, "TDStatus", oResourceBundle);
				},
				
				/**
				 * Method called when user Click on Chart Section on OutboundAperakMoni Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamOutAperakMoni: function (oNavigateParams, oSelectionVariantParams) {
					var sCombinedStatusKey = "NON_APERAK_LBL";
					var aIndividualStatusKey = ["NEGATIVE_CONTRL_SENT_STATUS_LBL", "POSITIVE_CONTRL_SENT_STATUS_LBL"];

					var aAdditionalFilters = [{
						property: "Direction",
						value: "O"
					}];
					
					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, aAdditionalFilters);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, aAdditionalFilters, sCombinedStatusKey, aIndividualStatusKey, "TDStatus", oResourceBundle);
				}
			});
	});