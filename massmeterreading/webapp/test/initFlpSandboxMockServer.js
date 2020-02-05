sap.ui.define([
	"./flpSandbox",
	"sap/ui/fl/FakeLrepConnectorLocalStorage",
	"sap/m/MessageBox"
], function (flpSandbox, FakeLrepConnectorLocalStorage, MessageBox) {
	"use strict";

	var aInitializations = [];

	// initialize the FLP SandBox
	aInitializations.push(flpSandbox.init());

	Promise.all(aInitializations).catch(function (oError) {
		MessageBox.error(oError.message);
	}).finally(function () {
		FakeLrepConnectorLocalStorage.enableFakeConnector();
	});
});