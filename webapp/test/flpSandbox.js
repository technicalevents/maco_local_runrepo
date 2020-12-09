sap.ui.define(
	["sap/base/util/ObjectPath", "sap/ui/thirdparty/datajs", "sap/ushell/services/Container"],
	function (ObjectPath, Odata) {
		"use strict";
		
		numberValue1: "",
		
		// define ushell config
		ObjectPath.set(["sap-ushell-config"], {
			defaultRenderer: "fiori2",
			bootstrapPlugins: {
				RuntimeAuthoringPlugin: {
					component: "sap.ushell.plugins.rta",
					config: {
						validateAppVersion: false
					}
				},
				PersonalizePlugin: {
					component: "sap.ushell.plugins.rta-personalize",
					config: {
						validateAppVersion: false
					}
				}
			},
			renderers: {
				fiori2: {
					componentData: {
						config: {
							enableSearch: false,
							rootIntent: "Shell-home"
						}
					}
				}
			},
			services: {
				LaunchPage: {
					adapter: {
						config: {
							groups: [{
								tiles: [{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Monitor Market Processes",
										targetURL: "#UtilsDataExchangeProcessing-displayProcess"
									}
								}, {
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Display Market Messages",
										targetURL: "#UtilsDataExchangeProcessing-displayMessage"
									}
								}, {
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Market Processes Overview",
										targetURL: "#UtilsDataExchangeProcessing-overviewProcess"
									}
								}, {
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Market Messages Overview",
										targetURL: "#UtilsDataExchangeProcessing-overviewMessage"
									}
								}, {
									tileType: "sap.ushell.ui.tile.DynamicTile",
									properties: {
										title: "Monitor Mass Meter Reading Processes",
										targetURL: "#UtilsDataExchangeProcessing-massMeterReading",
										numberValue: this.numberValue1
									}
								}]
							}, {
								id: "defaultGroupId2",
								title: "Market Communication Technical Self Service",
								tiles: [{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Execute Process Reports",
										targetURL: "#UtilsDataExchangeProcessing-processUiAction"
									}
								}]
							}, {
								id: "defaultGroupId3",
								title: "Market Communication Business Self Service",
								tiles: [{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Display Market Partners",
										icon: "sap-icon://BusinessSuiteInAppSymbols/icon-business-partner",
										targetURL: "#UtilsDataExchangeProcessing-displayMarketPartner"
									}
								},{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Maintain EDIFACT Contacts",
										icon: "sap-icon://contacts",
										targetURL: "#UtilsDataExchangeProcessing-maintMsgContact"
									}
								},{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Define EDIFACT Contact Rules",
										icon: "sap-icon://activity-assigned-to-goal",
										targetURL: "#UtilsDataExchangeProcessing-defineContactRule"
									}
								},{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Manage User Notifications",
										icon: "sap-icon://message-popup",
										targetURL: "#UtilsDataExchangeProcessing-userNotification"
									}
								}]
							}, {
								id: "defaultGroupId4",
								title: "Operation Apps",
								tiles: [{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Operation Overview",
										icon: "sap-icon://BusinessSuiteInAppSymbols/icon-business-partner",
										targetURL: "#UtilsDataExchangeProcessing-operationsOverview"
									}
								}, {
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Change Request Inbox",
										icon: "sap-icon://BusinessSuiteInAppSymbols/icon-change-request",
										targetURL: "#UtilsDataExchangeProcessing-changeRequest"
									}
								}]
							},
							{
								id: "defaultGroupId5",
								title: "EON Apps",
								tiles: [{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Display Instance",
										icon: "",
										targetURL: "#UtilsDataExchangeProcessing-displayInstance"
									}
								}]
							}]
						}
					}
				},
				ClientSideTargetResolution: {
					adapter: {
						config: {
							inbounds: {
								"UtilsDataExchangeProcessing-displayProcess": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "displayProcess",
									description: "Moniton Market Processes",
									title: "Moniton Market Processes",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "URL",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.displayprocesses",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/displayprocesses"
										)
									}
								},
								"UtilsDataExchangeProcessing-displayMessage": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "displayMessage",
									description: "Display Market Messages",
									title: "Display Market Messages",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "URL",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.displaymessages",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/displaymessages"
										)
									}
								},
								"UtilsDataExchangeProcessing-overviewProcess": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "overviewProcess",
									description: "Market Processes Overview",
									title: "Market Processes Overview",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.overviewprocesses",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/overviewprocesses"
										)
									}
								},
								"UtilsDataExchangeProcessing-overviewMessage": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "overviewMessage",
									description: "OverView Message",
									title: "OverView Message",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.overviewmessages",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/overviewmessages"
										)
									}
								},
								"UtilsDataExchangeProcessing-massMeterReading": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "massMeterReading",
									description: "Monitor Mass Meter Readings",
									title: "Monitor Mass Meter Readings",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.massmeterreadings",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/massmeterreadings"
										)
									}
								},
								"UtilsDataExchangeProcessing-processUiAction": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "processUiAction",
									description: "Execute Process Reports",
									title: "Execute Process Reports",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.processuiactions",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/processuiactions"
										)
									}
								},
								"UtilsDataExchangeProcessing-displayMarketPartner": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "displayMarketPartner",
									description: "Display Market Partners",
									title: "Display Market Partners",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.selfservice.ui.app.displaymarketpartners",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/selfservice/ui/app/displaymarketpartners"
										)
									}
								}, 
								"UtilsDataExchangeProcessing-maintMsgContact": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "maintMsgContact",
									description: "Maintain EDIFACT Contacts",
									title: "Maintain EDIFACT Contacts",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.selfservice.ui.app.maintmsgcontacts",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/selfservice/ui/app/maintmsgcontacts"
										)
									}
								},
								"UtilsDataExchangeProcessing-defineContactRule": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "defineContactRule",
									description: "Define EDIFACT Contact Rules",
									title: "Define EDIFACT Contact Rules",
									signature: {
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.selfservice.ui.app.definecontactrules",
										url: sap.ui.require.toUrl("com/sap/cd/maco/selfservice/ui/app/definecontactrules")
									}
								},
								"UtilsDataExchangeProcessing-userNotification": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "userNotification",
									description: "Manage User Notifications",
									title: "Manage User Notifications",
									signature: {
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.selfservice.ui.app.usernotifications",
										url: sap.ui.require.toUrl("com/sap/cd/maco/selfservice/ui/app/usernotifications")
									}
								},
								"UtilsDataExchangeProcessing-operationsOverview": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "operationsOverview",
									description: "Operation Overview",
									title: "Operation Overview",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.operation.ui.app.overviewoperations",
										url: sap.ui.require.toUrl("com/sap/cd/maco/operation/ui/app/overviewoperations")
									}
								},
								"UtilsDataExchangeProcessing-changeRequest": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "changeRequest",
									description: "Change Request Inbox",
									title: "Change Request Inbox",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.operation.ui.app.changeRequestInbox",
										url: sap.ui.require.toUrl("com/sap/cd/maco/operation/ui/app/changeRequestInbox")
									}
								},
								"UtilsDataExchangeProcessing-displayInstance": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "displayInstance",
									description: "Display Instance",
									title: "Display Instance",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.us4g.DisplayInstance",
										url: sap.ui.require.toUrl("com/sap/cd/us4g/DisplayInstance")
									}
								}
							}
						}
					}
				},
				NavTargetResolution: {
					config: {
						enableClientSideTargetResolution: true
					}
				}
			}
		});

		var oFlpSandbox = {
			/**
			 * Initializes the FLP sandbox
			 * @returns {Promise} a promise that is resolved when the sandbox bootstrap has finshed
			 */
			init: function () {
				// sandbox is a singleton, so we can start it only once
				if (!this._oBootstrapFinished) {
					this._oBootstrapFinished = sap.ushell.bootstrap("local");
					this._oBootstrapFinished.then(function () {
						sap.ushell.Container.createRenderer().placeAt("content");
					});
				}
				return this._oBootstrapFinished;
			}
		};

		return oFlpSandbox;
	});