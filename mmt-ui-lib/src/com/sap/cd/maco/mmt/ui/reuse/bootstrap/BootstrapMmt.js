sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/bootstrap/BootstrapNoDraft', 'sap/ui/model/json/JSONModel', 'com/sap/cd/maco/mmt/ui/reuse/mmt/valueHelpValues'],
  function(BootstrapNoDraft, JSONModel, valueHelpValues) {
    'use strict';

    return BootstrapNoDraft.extend('com.sap.cd.maco.mmt.ui.reuse.mmt.bootstrap.BootstrapMmt', {
      initComponent: function() {
        BootstrapNoDraft.prototype.initComponent.apply(this, arguments); // super
        this.initVHModel();
      },

      initVHModel: function() {
        var oVHModel = new JSONModel(valueHelpValues);
        oVHModel.setDefaultBindingMode('OneWay');
        this._oComponent.setModel(oVHModel, 'valueHelp');
      }
    });
  }
);
