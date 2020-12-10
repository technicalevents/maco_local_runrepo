sap.ui.define(
	[
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/Sorter"
	],

	function (Controller, Sorter) {
		'use strict';

		return Controller.extend(
			'com.sap.cd.us4g.DisplayInstance.view.InstanceListReport', {
				/**
				 * Event is triggered before data loading of smart table
				 * @param {object} oEvent Table loading event
				 * @public
				 */
				onBeforeRebindTable: function (oEvent) {
					oEvent.getParameter("bindingParams").sorter.push(new Sorter("InstanceId", true, true));
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