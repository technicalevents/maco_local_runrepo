/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"com/sap/cd/maco/monitor/ui/app/displaymessage/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});