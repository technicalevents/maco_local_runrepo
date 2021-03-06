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
					  case "ExpDocLoadLOverview":
					  	fnCustomParam = this._getCustomParamExpDocLocalOverview.bind(this);
					  	break;
					  case "ExpDocLoadROverview":
					  	fnCustomParam = this._getCustomParamExpDocRemoteOverview.bind(this);
					  	break;
					  case "ExpDoErrorOverview":
					  	fnCustomParam = this._getCustomParamExpDocLocalOverview.bind(this);
					  	break;
					  case "ExpDocOthersOverview":
					  	fnCustomParam = this._getCustomParamExpDocLocalOverview.bind(this);
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
					var aCustomStatusKeys = ["NERR"];
					var oCustomStatusMapping = {
						"NERR": ["ACTV","CMPL","HOLD","REV","TERM"]
					};
					
					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);
					
					delete oNavigationParams["ProcessStatusCount"];
					delete oNavigationParams["StatusCriticality"];
					delete oNavigationParams["ProcessStatusDescription"];
					
					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigationParams, [], aCustomStatusKeys, oCustomStatusMapping);
					
					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				},

				/**
				 * Method called when user Click on Chart Section on ExpDocStatusOverview Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamExpDocStatusOverview: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["NERR"];
					var oCustomStatusMapping = {
						"NERR": ["ACTV","CMPL","CONF", "NEW"]
					};
					
					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);
					
					delete oNavigationParams["ExceptionDocStatusCount"];
					delete oNavigationParams["StatusCriticality"];
					delete oNavigationParams["ExceptionStatusDescription"];


					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigateParams, [], aCustomStatusKeys, oCustomStatusMapping);
					
					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				},

				/**
				 * Method called when user Click on Chart Section on TDocStatusOverview Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamTDocStatusOverview: function (oNavigateParams, oSelectionVariantParams) {
					var aCustomStatusKeys = ["NERR"];
					var oCustomStatusMapping = {
						"NERR": ["CMPL","INFO", "HOLD", "QUEUE", "REV",
												"SENT", "AGGR" ]
					};
					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);
					
					delete oNavigationParams["TdocStatusCount"];
					delete oNavigationParams["StatusCriticality"];
					delete oNavigationParams["TdocStatusDescription"];
					
					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigateParams, [], aCustomStatusKeys, oCustomStatusMapping);
					
					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				},
				
				/**
				 * Method called when user Click on Chart Section on ExpDocLocal Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamExpDocLocalOverview: function (oNavigateParams, oSelectionVariantParams) {
					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);
					
					var aAdditionalFilters = [{
						property: "Remote",
						value1: "",
						operator: "EQ"
					}];
					
					delete oNavigationParams["ExceptionCodeCount"];
					delete oNavigationParams["ExceptionCodeDescription"];
					delete oNavigationParams["ExceptionstatusDescription"];
					delete oNavigationParams["BusinessObjectTypeDescription"];

					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigationParams, aAdditionalFilters, [], {});
					
					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				},
				
				/**
				 * Method called when user Click on Chart Section on ExpDocLocal Card
				 * @private
				 * @param {object} oNavigateParams Navigation Parameters
				 * @param {object} oSelectionVariantParams Selection Variant Parameters
				 */
				_getCustomParamExpDocRemoteOverview: function (oNavigateParams, oSelectionVariantParams) {
					var oNavigationParams = jQuery.extend(true, {}, oNavigateParams);
					
					var aAdditionalFilters = [{
						property: "Remote",
						value1: "H",
						operator: "EQ"
					}];
					
					delete oNavigationParams["ExceptionDocStatusCount"];
					delete oNavigationParams["StatusCriticality"];

					var aNavigationFilers = ExtControllerUtility.getNavigationFilterDetails(oNavigationParams, aAdditionalFilters, [], {});
					
					return ExtControllerUtility.generateCustomParams(aNavigationFilers, oSelectionVariantParams);
				}
				
				
			});
	});