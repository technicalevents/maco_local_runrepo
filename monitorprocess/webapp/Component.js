sap.ui.define([
	"sap/ovp/app/Component"
], function (Component) {
	"use strict";

	return Component.extend("com.sap.cd.maco.monitor.ui.app.monitorprocesses.Component", {
		metadata: {
			manifest: "json"
		},

		init: function () {
			// super
			Component.prototype.init.apply(this, arguments);

		},

		destroy: function () {
			// super
			Component.prototype.destroy.apply(this, arguments);
		}
	});
});