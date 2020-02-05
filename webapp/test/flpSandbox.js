sap.ui.define(
	["sap/base/util/ObjectPath", "sap/ushell/services/Container"],
	function (ObjectPath) {
		"use strict";

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
										title: "Moniton Market Processes",
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
										title: "Overview Process",
										targetURL: "#UtilsDataExchangeProcessing-overviewProcess"
									}
								},{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Overview Message",
										targetURL: "#UtilsDataExchangeProcessing-overviewMessage"
									}
								}, {
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Monitor Mass Meter Readings",
										targetURL: "#UtilsDataExchangeProcessing-massMeterReading"
									}
								}, {
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Monitor Invoice Meter Readings",
										targetURL: "#UtilsDataExchangeProcessing-invoicemeterreadings"
									}
								}]
							}, {
								id: "defaultGroupId2",
								title: "Self Service",
								tiles: [{
									tileType: "sap.ushell.ui.tile.StaticTile",
									properties: {
										title: "Execute Process Reports",
										targetURL: "#UtilsDataExchangeProcessing-processUiAction"
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
									description: "OverView Process",
									title: "OverView Process",
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
								"UtilsDataExchangeProcessing-invoiceMeterReading": {
									semanticObject: "UtilsDataExchangeProcessing",
									action: "invoiceMeterReading",
									description: "Monitor Invoice Meter Readings",
									title: "Monitor Invoice Meter Readings",
									signature: {
										additionalParameters: "allowed",
										parameters: {}
									},
									resolutionResult: {
										applicationType: "SAPUI5",
										additionalInformation: "SAPUI5.Component=com.sap.cd.maco.monitor.ui.app.invoicemeterreadings",
										url: sap.ui.require.toUrl(
											"com/sap/cd/maco/monitor/ui/app/invoicemeterreadings"
										)
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
			init: function () {
				/**
				 * Initializes the FLP sandbox
				 * @returns {Promise} a promise that is resolved when the sandbox bootstrap has finshed
				 */

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