/*global QUnit*/

sap.ui.define([
	"com/sap/cd/us4g/DsiplayInstance/controller/InstanceListReport.controller"
], function (Controller) {
	"use strict";

	QUnit.module("InstanceListReport Controller");

	QUnit.test("I should test the InstanceListReport controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});