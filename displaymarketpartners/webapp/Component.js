sap.ui.define(
	[
		"com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorComponent",
		"com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
		"com/sap/cd/maco/mmt/ui/reuse/action/nav/NavToRouteAction",
		"com/sap/cd/maco/selfservice/ui/app/displaymarketpartners/actions/CreateChangeRequestAction",
    	"com/sap/cd/maco/mmt/ui/reuse/action/share/ShareAction"
	],
	function (MonitorComponent, HashSync, NavToRouteAction, CreateChangeRequestAction, ShareAction) {
		"use strict";

		return MonitorComponent.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.Component", {
			metadata: {
				manifest: "json"
			},

			/**
			 * Function is used to initialize MonitorComponent
			 * @public
			 */
			init: function () {
				// call the base component"s init function
				MonitorComponent.prototype.init.apply(this, arguments);

				this.mActions = {
					navToPartnerPage: new NavToRouteAction(this),
					createChangeRequestAction: new CreateChangeRequestAction(this),
					share: new ShareAction(this, {
						appTitleMsgKey: "APP_TITLE",
						objectIdProperty: "PartnerId",
						objectTextProperty: "Title"
					})
				};

				this.initRouting();
			},

			/**
			 * Function is used to initialize Router
			 * @public
			 */
			initRouting: function () {
				// sync hash
				var oHashSync = new HashSync({
					component: this,
					message: this.oMessage,
					getRouteName: function (startupParams) {
						return "partnerPage";
					}
				});
				oHashSync.synch();

				// create the views based on the url/hash
				this.getRouter().initialize();
			}
		});
	}
);