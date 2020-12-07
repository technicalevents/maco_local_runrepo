/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/sap/cd/us4g/DsiplayInstance/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});