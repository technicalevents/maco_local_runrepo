/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function() {
	"use strict";

	sap.ui.require([
		"com/sap/cd/maco/monitor/ui/app/displayprocess/test/integration/AllJourneys"
	], function() {
		QUnit.start();
	});
});