sap.ui.define([
		"com/sap/cd/maco/mmt/ui/reuse/controller/objectPage/ObjectPageNoDraftController",
		"com/sap/cd/maco/monitor/ui/app/displayprocesses/util/formatter"
	],
	function (ObjectPageNoDraftController, Formatter) {
		'use strict';

		return ObjectPageNoDraftController.extend(
			'com.sap.cd.maco.selfservice.ui.app.displaymarketpartners.view.PartnerPage', {
				
				formatter: Formatter,
				
				onInit: function () {
					var oPartnerActions = this.getOwnerComponent().actions.partner;
					ObjectPageNoDraftController.prototype.onInit.call(this, {
						entitySet: 'Partners',
						i18n: {
							notFoundMsg: this.notFoundMsg.bind(this)
						},
						controls: {
							objectPage: 'objectPage'
						},
						routes: {
							this: 'partnerPage',
							parent: 'listReport'
						},
						actions: {}
					});
				},

				notFoundMsg: function (oRouteArgs) {
					return this.oBundle.getText('partnerNotFound', [oRouteArgs.Pid, oRouteArgs.UUID]);
				}
			}
		);
	});