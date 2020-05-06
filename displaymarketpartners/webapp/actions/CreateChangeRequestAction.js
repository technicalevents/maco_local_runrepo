sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseAction",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Utility",
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
	"com/sap/cd/maco/mmt/ui/reuse/action/nodraft/CreateWithDialogAction",
	"com/sap/cd/maco/selfservice/ui/app/displaymarketpartners/actions/CreatetChngReqActionController"

], function (BaseAction, Utility, Constants, CreateWithDialogAction, CreatetChngReqActionController) {
	"use strict";

	return BaseAction.extend("com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.actions.CreateChangeRequestAction", {
		/******************************************************************* */
		/* CONSTRUCTOR */
		/******************************************************************* */

		/**
		 * Constructor
		 */
		constructor: function (oComponent, oConfig) {
			BaseAction.call(this, oComponent, oConfig);

			this._oCreateEmailChangeRequest = new CreateWithDialogAction(oComponent, {
				fragmentName: "com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.changereq.ChangeRequestEmailDialog",
				fragmentControllerClass: CreatetChngReqActionController,
				title: "EMAIL_ADDRESS_CHANGE_REQUEST",
				successMsg: "EMAIL_ADDRESS_CHANGE_REQUEST_SUCC_MSG"
			});
		},

		/******************************************************************* */
		/* PUBLIC METHODS */
		/******************************************************************* */

		/**
		 * Function is triggered on click of Execute Message Aggregation button in List Page
		 * @public
		 */
		execute: function (oParams) {
			return new Promise(function (resolve, reject) {
				// Store params for async usage
				this._oParams = oParams;

				// store params for async usage
				this._oView = oParams.busyControl;

				// create Change Request action sheet only once
				if (!this._oCreateChangeReqActionSheet) {
					this._oCreateChangeReqActionSheet = sap.ui.xmlfragment(
						"com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.changereq.CreateChangeReqActionSheet", this);
					oParams.busyControl.addDependent(this._oExecuteMsgAggrActionSheet);

					this._oCreateChangeReqActionSheet.setModel(this.oModel);
				}

				this._oCreateChangeReqActionSheet.openBy(oParams.event.getSource());

				// done
				resolve({
					params: oParams
				});
			}.bind(this));
		},

		/**
		 * Function is triggered on selection of Change Request Type from Change Request Type action sheet
		 * @param {sap.ui.base.Event} oEvent   Buttion press event
		 * @public
		 */
		onChangeRequesTypeSelection: function (oEvent) {

			this._oParams.properties = {
				ChangeRequestType: "EMAIL",
				Action: "C",
				BODocNo: this._oView.getModel("this").getProperty("/PartnerId")
			};

			this._oCreateEmailChangeRequest.execute(this._oParams);
		}
	});
});