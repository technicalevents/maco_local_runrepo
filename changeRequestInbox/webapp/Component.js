sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/monitor/MonitorComponent",
	"com/sap/cd/maco/mmt/ui/reuse/fnd/nav/HashSync",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/NavToMarketPartnerAction",
	"com/sap/cd/maco/mmt/ui/reuse/action/nodraft/UpdateWithDialogAction",
	"com/sap/cd/maco/operation/ui/app/changeRequestInbox/actions/DownloadCertificateAction",
	"com/sap/cd/maco/operation/ui/app/changeRequestInbox/actions/AcceptChangeRequestDialog",
	"com/sap/cd/maco/operation/ui/app/changeRequestInbox/actions/AcceptCertChangeRequestDialog",
	"com/sap/cd/maco/operation/ui/app/changeRequestInbox/actions/RejectChangeRequestDialog"
],function (MonitorComponent, HashSync, NavToMarketPartnerAction, UpdateWithDialogAction, 
			DownloadCertificateAction, AcceptChangeRequestDialog, AcceptCertChangeRequestDialog, 
			RejectChangeRequestDialog) {
	"use strict";

	return MonitorComponent.extend("com.sap.cd.maco.operation.ui.app.changeRequestInbox.Component", {
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
				navMarketPartnerAction: new NavToMarketPartnerAction(this, "BODocNo"),
				downloadCertificateAction: new DownloadCertificateAction(this),
				acceptChangeRequest: new UpdateWithDialogAction(this, {
					fragmentName: "com.sap.cd.maco.operation.ui.app.changeRequestInbox.actions.AcceptChangeRequest",
					fragmentControllerClass: AcceptChangeRequestDialog,
					title: "ACCEPT_CHANGE_REQUEST"
				}),
				acceptCertChangeRequest: new UpdateWithDialogAction(this, {
					fragmentName: "com.sap.cd.maco.operation.ui.app.changeRequestInbox.actions.AcceptCertChangeRequest",
					fragmentControllerClass: AcceptCertChangeRequestDialog,
					title: "ACCEPT_CHANGE_REQUEST"
				}),
				rejectChangeRequest: new UpdateWithDialogAction(this, {
					fragmentName: "com.sap.cd.maco.operation.ui.app.changeRequestInbox.actions.RejectChangeRequest",
					fragmentControllerClass: RejectChangeRequestDialog,
					title: "REJECT_CHANGE_REQUEST"
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
					return "listReport";
				}
			});
			oHashSync.synch();

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});
});