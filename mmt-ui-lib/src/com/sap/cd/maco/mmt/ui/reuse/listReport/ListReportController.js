sap.ui.define(
  [
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/table/SmartTableController',
    'com/sap/cd/maco/mmt/ui/reuse/_/getConfigControl'
  ],
  function(JSONModel, bundle, SmartTableController, getConfigControl) {
    'use strict';

    return SmartTableController.extend('com.sap.cd.maco.mmt.ui.reuse.listReport.ListReportController', {
      onInit: function(oConfig) {
        // super
        SmartTableController.prototype.onInit.apply(this, arguments);

        // store config
        this.oConfig = oConfig;

        // check config
        this.oAssert.ok(oConfig, 'ListReportController cannot init. config missing');
        this.oAssert.ok(oConfig.controls, 'ListReportController cannot init. controls missing');
      },

      getVariantManagement: function() {
        return getConfigControl(this, 'variantManagement', 'sap.ui.comp.smartvariants.SmartVariantManagement', false);
      },

      getFilterBar: function() {
        return getConfigControl(this, 'filterBar', 'sap.ui.comp.smartfilterbar.SmartFilterBar', true);
      }
    });
  }
);
