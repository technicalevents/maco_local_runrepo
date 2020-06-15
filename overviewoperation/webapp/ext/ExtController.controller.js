sap.ui.define([
		"com/sap/cd/maco/mmt/ui/reuse/monitor/ExtControllerUtility"
	],
	function (ExtControllerUtility) {
		'use strict';

		sap.ui.controller(
			'com.sap.cd.maco.operation.ui.app.overviewoperations.ext.ExtController', {

				/**
				 * LifeCycle Method
				 */
				/**
				 * Event Method:- Triggered on Click on Chart Section for Navigating to Respective Application
				 * @public
				 * @param {string} sCardName card name
				 */
				onCustomParams: function (sCardName) {
					var fnCustomParam;
					
					switch(sCardName) {
					  case "PDocStatusOverview":
					    fnCustomParam = this._getCustomParamPDocStatusOverview.bind(this);
					    break;
					  case "ExpDocStatusOverview":
					    fnCustomParam = this._getCustomParamExpDocStatusOverview.bind(this);
					    break;
					  case "TDocStatusOverview":
					  	fnCustomParam = this._getCustomParamTDocStatusOverview.bind(this);
					  	break;
					  case "PDocLoadOverview":
					  case "PDoErrorOverview":
					  case "PDoStatCustOverview":
						fnCustomParam = this._getCustomParamPDocCards.bind(this);
						break;
					  case "ExpDocStatusOverview":
					  case "ExpDocLoadROverview":
					  case "ExpDocLoadLOverview":	
					  case "ExpDoErrorOverview":
					  case "ExpDocOthersOverview":
					  	fnCustomParam = this._getCustomParamExpDocCards.bind(this);
					  	break;
					  case "TDocLoadOverview":
					  case "TDoErrorOverview":
					  case "TDocOthersOverview":
					  	fnCustomParam = this._getCustomParamTDocCards.bind(this);
					  	break;
					  default:
					    // code block
					}
					
					return fnCustomParam;
				},
				
				/**
				 * Method called when user Click on Chart Section on PDocStatusOverview Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamPDocStatusOverview: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["NERR_STATUS_KEY_TXT"];
					var oCustomStatusMapping = {
						"NERR_STATUS_KEY_TXT": ["ACTIVE_NEW_STATUS_LBL","COMPLETED_STATUS_LBL","ONHOLD_STATUS_LBL",
												"REVERSED_STATUS_LBL","TERMINATED_STATUS_LBL"]
					};
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					
					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, []);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, [], aCustomStatusKeys, oCustomStatusMapping,
						"ProcessStatus", oResourceBundle);
				},

				/**
				 * Method called when user Click on Chart Section on ExpDocStatusOverview Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamExpDocStatusOverview: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["NERR_STATUS_KEY_TXT"];
					var oCustomStatusMapping = {
						"NERR_STATUS_KEY_TXT": ["ACTIVE_STATUS_LBL","COMPLETED_STATUS_LBL","CONFIRMED_STATUS_LBL",
												"NEW_STATUS_LBL"]
					};
					
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();


					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, []);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, [], aCustomStatusKeys, oCustomStatusMapping,
						"Exceptionstatus", oResourceBundle);
				},

				/**
				 * Method called when user Click on Chart Section on TDocStatusOverview Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamTDocStatusOverview: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["NERR_STATUS_KEY_TXT", "ERR_STATUS_TXT"];
					var oCustomStatusMapping = {
						"NERR_STATUS_KEY_TXT": ["COMPLETED_TDOC_STATUS_LBL","INFO_TDOC_STATUS_LBL", "QUEUED_TDOC_STATUS_LBL", "REVERSED_OBSOLUTE_STATUS_LBL",
												"TRANSFER_SENT", "AGGREGATED_STATUS_LBL" ],
						"ERR_STATUS_TXT": ["ERR_TDOC_STATUS_LBL"]
					};
					
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, []);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, [], aCustomStatusKeys, oCustomStatusMapping,
						"Status", oResourceBundle);
				},
				
				/**
				 * Method called when user Click on Chart Section on PDoc Cards
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamPDocCards: function(oNavigateParams, oSelectionVariantParams){
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					
					var aAdditionalFilters = [{
						property: "CreateAt",
						operator:"BT",
						value1: oNavigateParams["CreateAt"],
						value2: new Date(new Date(oNavigateParams["CreateAt"]).getTime() + 60 * 60 * 24 * 1000)
					}];
					
					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, []);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, aAdditionalFilters, [], {},
						"ProcessStatus", oResourceBundle);
				},
				
				/**
				 * Method called when user Click on Chart Section on ExpDoc Cards
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamExpDocCards: function(oNavigateParams, oSelectionVariantParams){
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					
					var aAdditionalFilters = [{
						property: "CreatedAt",
						operator:"BT",
						value1: oNavigateParams["CreatedAt"],
						value2: new Date(new Date(oNavigateParams["CreatedAt"]).getTime() + 60 * 60 * 24 * 1000)
					}];
					
					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, []);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, aAdditionalFilters, [], {},
						"Exceptionstatus", oResourceBundle);
				},
				
				/**
				 * Method called when user Click on Chart Section on TpDoc Cards
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamTDocCards: function(oNavigateParams, oSelectionVariantParams){
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					
					var aAdditionalFilters = [{
						property: "created_at",
						operator:"BT",
						value1: oNavigateParams["created_at"],
						value2: new Date(new Date(oNavigateParams["created_at"]).getTime() + 60 * 60 * 24 * 1000)
					}];
					
					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, []);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, aAdditionalFilters, [], {},
						"Status", oResourceBundle);
				}
				
				
			});
	});