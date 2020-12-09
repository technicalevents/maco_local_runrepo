sap.ui.define(
	[
		'com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController',
		'com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate',
		"sap/ui/model/Sorter"
	],

	function (ListReportNoDraftController, SmartTableBindingUpdate, Sorter) {
		'use strict';

		return ListReportNoDraftController.extend(
			'com.sap.cd.us4g.DisplayInstance.view.InstanceListReport', {
				/**
				 * Lifecycle Event
				 * @public
				 */
				onInit: function () {
					ListReportNoDraftController.prototype.onInit.call(this, {
						controls: {
							table: 'smartTable'
						},
						routes: {
							child: 'InstanceDetailPage'
						},
						entitySet: 'INST_DATASet',
						actions: this.getOwnerComponent().mActions,
						tableAccessControl: {
							navToInstancePage: true
						}
					});
				},
				/**
				 * Event is triggered before data loading of smart table
				 * @param {object} oEvent Table loading event
				 * @public
				 */
				onBeforeRebindTable: function (oEvent) {
					var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter("bindingParams"));
					var aSorters = [];
						aSorters.push(new Sorter("InstanceId", true, true));

					oUpdate.addSorters(aSorters);

				},
				
				/**
				 * Event is triggered before Data Export
				 * @param {object} oEvent Data Export Event object
				 * @public
				 */
				onBeforeExport: function (oEvent) {
					var oSettings = oEvent.getParameter('exportSettings');
					oSettings.dataSource.sizeLimit = 1000;
					if (oSettings.workbook && oSettings.workbook.columns) {
					  oSettings.workbook.columns.forEach(function(oColumn) {
					    if (oColumn.property === 'ValidFrom' || oColumn.property === 'ValidTo') {
					      oColumn.type = sap.ui.export.EdmType.DateTime;
					    }
					  });
					}
				}
			}
		);
	});