sap.ui.define([
	"sap/ovp/app/Component"
], function (Component) {
	"use strict";

	return Component.extend("com.sap.cd.maco.operation.ui.app.overviewoperations.Component", {
		metadata: {
			manifest: "json"
		},

		 /**
       	  * Function is used to initialize Component
       	  */
		init: function () {
			// super
			Component.prototype.init.apply(this, arguments);

		},
		
		/**
       	 * Function is triggered on exit of Application 
       	 */
		destroy: function () {
			// super
			Component.prototype.destroy.apply(this, arguments);
		}
	});
});