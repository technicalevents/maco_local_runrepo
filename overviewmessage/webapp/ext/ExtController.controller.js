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
				 * LifeCycle Method which is tringered on Rendering ofx the Application
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
					if (sCardName === "OverallOutboundDeliveryStatus") {
						return this._getCustomParamOverallOutDelStatus.bind(this);
					} else if (sCardName === "OverallInboundMessageProcessStatus") {
						return this._getCustomParamOverallInbDelStatus.bind(this);
					} else if (sCardName === "InboundAperakMoni") {
						return this._getCustomParamInbAperakMoni.bind(this);
					} else if (sCardName === "OutboundAperakMoni") {
						return this._getCustomParamOutAperakMoni.bind(this);
					} else if (sCardName === "OutboundMessageDeliveryRate") {
						return this._getCustomParamOutboundMessageDeliveryRate.bind(this);
					} else if (sCardName === "InboundMessageDeliveryRate") {
						return this._getCustomParamInboundMessageDeliveryRate.bind(this);
					} else {
						// do nothing
					}
				},

				/**
				 * Method called when user Click on Chart Section on OverallOutDelStatus Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamOverallOutDelStatus: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["APERAK_POSITIVE_CONTRL_RECEIVED_LBL"];
					var oCustomStatusMapping = {
						"APERAK_POSITIVE_CONTRL_RECEIVED_LBL": ["APERAK_RECEIVED_STATUS_LBL", "POSITIVE_CONTRL_RECEIVED_STATUS_LBL"]
					};
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

					var aAdditionalFilters = [{
						property: "Direction",
						operator: "EQ",
						value1: "O"
					}];

					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);

					delete oNavigationParams["MessageStatusCount"];
					delete oNavigationParams["StatusCriticality"];

					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigationParams, aAdditionalFilters, aCustomStatusKeys,
						oCustomStatusMapping, oResourceBundle);

					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				},

				/**
				 * Method called when user Click on Chart Section on OverallInboundDelStatus Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamOverallInbDelStatus: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["APERAK_POSITIVE_CONTRL_SENT_LBL"];
					var oCustomStatusMapping = {
						"APERAK_POSITIVE_CONTRL_SENT_LBL": ["APERAK_SENT_STATUS_LBL", "POSITIVE_CONTRL_SENT_STATUS_LBL"]
					};
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

					var aAdditionalFilters = [{
						property: "Direction",
						value1: "I",
						operator: "EQ"
					}];

					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);

					delete oNavigationParams["StatusCriticality"];
					delete oNavigationParams["MessageStatusCount"];

					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigationParams, aAdditionalFilters, aCustomStatusKeys,
						oCustomStatusMapping, oResourceBundle);

					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				},

				/**
				 * Method called when user Click on Chart Section on InboundAperakMoni Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamInbAperakMoni: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["APERAK_SENT_CUSTOM_LBL", "POSITIVE_MESSAGE_CUSTOM_LBL"];
					var oCustomStatusMapping = {
						"APERAK_SENT_CUSTOM_LBL": ["APERAK_SENT_LBL"],
						"POSITIVE_MESSAGE_CUSTOM_LBL": ["POSITIVE_CONTRL_RECEIVED_STATUS_LBL", "NEGATIVE_CONTRL_RECEIVED_STATUS_LBL",
							"SENT_WAIT_ACK_STATUS_LBL", "NEW_STATUS_LBL"
						]
					};
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

					var aAdditionalFilters = [{
						property: "Direction",
						value1: "I",
						operator: "EQ"
					}];

					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);

					delete oNavigationParams["StatusCriticality"];
					delete oNavigationParams["MessageStatusCount"];

					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigationParams, aAdditionalFilters, aCustomStatusKeys,
						oCustomStatusMapping, oResourceBundle);

					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				},

				/**
				 * Method called when user Click on Chart Section on OutboundAperakMoni Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamOutAperakMoni: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["APERAK_RECEIVED_CUSTOM_LBL", "POSITIVE_MESSAGE_CUSTOM_LBL"];
					var oCustomStatusMapping = {
						"APERAK_RECEIVED_CUSTOM_LBL": ["APERAK_RECEIVED_LBL"],
						"POSITIVE_MESSAGE_CUSTOM_LBL": ["NEGATIVE_CONTRL_SENT_STATUS_LBL", "POSITIVE_CONTRL_SENT_STATUS_LBL"]
					};
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

					var aAdditionalFilters = [{
						property: "Direction",
						value1: "O",
						operator: "EQ",
					}];

					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);

					delete oNavigationParams["StatusCriticality"];
					delete oNavigationParams["MessageStatusCount"];

					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigationParams, aAdditionalFilters, aCustomStatusKeys,
						oCustomStatusMapping, oResourceBundle);

					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				},

				/**
				 * Method called when user Click on Chart Section on OutboundAperakMoni Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamOutboundMessageDeliveryRate: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["APERAK_POSITIVE_CONTRL_RECEIVED_LBL"];
					var oCustomStatusMapping = {
						"APERAK_POSITIVE_CONTRL_RECEIVED_LBL": ["POSITIVE_CONTRL_RECEIVED_STATUS_LBL", "APERAK_RECEIVED_STATUS_LBL"]
					};
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

					var aAdditionalFilters = [{
						property: "Direction",
						value1: "O",
						operator: "EQ"
					}];

					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);

					delete oNavigationParams["OwnMarketPartnerText"];
					delete oNavigationParams["StatusCriticality"];
					delete oNavigationParams["MessageStatusCount"];

					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigationParams, aAdditionalFilters, aCustomStatusKeys,
						oCustomStatusMapping, oResourceBundle);

					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				},

				/**
				 * Method called when user Click on Chart Section on OutboundAperakMoni Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamInboundMessageDeliveryRate: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["APERAK_POSITIVE_CONTRL_SENT_LBL"];
					var oCustomStatusMapping = {
						"APERAK_POSITIVE_CONTRL_SENT_LBL": ["POSITIVE_CONTRL_SENT_STATUS_LBL", "APERAK_SENT_STATUS_LBL"]
					};

					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

					var aAdditionalFilters = [{
						property: "Direction",
						value1: "I",
						operator: "EQ"
					}];

					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);

					delete oNavigationParams["OwnMarketPartnerText"];
					delete oNavigationParams["StatusCriticality"];
					delete oNavigationParams["MessageStatusCount"];

					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigationParams, aAdditionalFilters, aCustomStatusKeys,
						oCustomStatusMapping, oResourceBundle);

					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				}
			});
	});