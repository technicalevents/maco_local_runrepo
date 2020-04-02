sap.ui.define(
  [
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/controller/table/SmartTableController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(JSONModel, bundle, SmartTableController, Assert) {
    'use strict';

    return SmartTableController.extend('com.sap.cd.maco.mmt.ui.reuse.controller.listReport.ListReportController', {
      onInit: function(oConfig) {
        // super
        SmartTableController.prototype.onInit.apply(this, arguments);

        // store config
        this.oConfig = oConfig;

        // check config
        Assert.ok(oConfig, 'ListReportController cannot init. config missing');
        Assert.ok(oConfig.controls, 'ListReportController cannot init. controls missing');
      },

      getVariantManagement: function() {
        return this.getConfigControl('variantManagement', 'sap.ui.comp.smartvariants.SmartVariantManagement', false);
      },

      getFilterBar: function() {
        return this.getConfigControl('filterBar', 'sap.ui.comp.smartfilterbar.SmartFilterBar', true);
      }
    });
  }
);
