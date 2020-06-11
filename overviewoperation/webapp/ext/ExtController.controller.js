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
					
					if (sCardName === "PDocStatusOverview") {
						fnCustomParam = this._getCustomParamPDocStatusOverview.bind(this);
					} else if (sCardName === "ExpDocStatusOverview") {
						fnCustomParam = this._getCustomParamExpDocStatusOverview.bind(this);
					} else if (sCardName === "TDocStatusOverview") {
						fnCustomParam = this._getCustomParamTDocStatusOverview.bind(this);
					} else if (sCardName === "PDocLoadOverview") {
						fnCustomParam = this._getCustomParamPDocLoadOverview.bind(this);
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
					var aCustomStatusKeys = ["NERR_STATUS_TXT"];
					var oCustomStatusMapping = {
						"NERR_STATUS_TXT": ["ACTIVE_NEW_STATUS_LBL","COMPLETED_STATUS_LBL","ONHOLD_STATUS_LBL",
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
					var aCustomStatusKeys = ["NERR_STATUS_TXT"];
					var oCustomStatusMapping = {
						"NERR_STATUS_TXT": ["ACTIVE_STATUS_LBL","COMPLETED_STATUS_LBL","CONFIRMED_STATUS_LBL",
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
					var aCustomStatusKeys = ["NERR_STATUS_TXT", "ERR_STATUS_TXT"];
					var oCustomStatusMapping = {
						"NERR_STATUS_TXT": ["COMPLETED_TDOC_STATUS_LBL","INFO_TDOC_STATUS_LBL", "QUEUED_TDOC_STATUS_LBL", "REVERSED_OBSOLUTE_STATUS_LBL",
												"TRANSFER_SENT", "AGGREGATED_STATUS_LBL" ],
						"ERR_STATUS_TXT": ["ERR_TDOC_STATUS_LBL"]
					};
					
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();

					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, []);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, [], aCustomStatusKeys, oCustomStatusMapping,
						"TdocStatus", oResourceBundle);
				},
				
				_getCustomParamPDocLoadOverview: function(oNavigateParams, oSelectionVariantParams){
					var oResourceBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
					
					// var aAdditionalFilters = [{
					// 	property: "CreateAt",
					// 	operator:"BT"
					// 	value1: oNavigateParams["CreateAt"]
					// 	value2: new Date(new Date(oNavigateParams.CreateAt).getTime() + 60 * 60 * 24 * 1000);
					// }];
					
					ExtControllerUtility.addSelectionFilters(oSelectionVariantParams, []);

					return ExtControllerUtility.generateCustomParams(oNavigateParams, aAdditionalFilters, [], {},
						"ProcessStatus", oResourceBundle);
				}
				
			});
	});