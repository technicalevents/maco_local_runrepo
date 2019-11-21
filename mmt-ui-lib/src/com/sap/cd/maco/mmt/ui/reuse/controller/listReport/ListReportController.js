sap.ui.define(
  [
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/controller/table/SmartTableController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/getConfigControl',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(JSONModel, bundle, SmartTableController, getConfigControl, Assert) {
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
        return getConfigControl(this, 'variantManagement', 'sap.ui.comp.smartvariants.SmartVariantManagement', false);
      },

      getFilterBar: function() {
        return getConfigControl(this, 'filterBar', 'sap.ui.comp.smartfilterbar.SmartFilterBar', true);
      }
    });
  }
);
