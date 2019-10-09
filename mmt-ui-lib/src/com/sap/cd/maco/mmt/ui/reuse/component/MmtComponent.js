sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/component/NoDraftComponent', 'sap/ui/model/json/JSONModel', 'com/sap/cd/maco/mmt/ui/reuse/mmt/valueHelpValues'],
  function(NoDraftComponent, JSONModel, valueHelpValues) {
    'use strict';

    return NoDraftComponent.extend('com.sap.cd.maco.mmt.ui.reuse.component.MmtComponent', {
      init: function() {
        NoDraftComponent.prototype.init.apply(this, arguments);
        this.initVHModel();
      },

      initVHModel: function() {
        var oVHModel = new JSONModel(valueHelpValues);
        oVHModel.setDefaultBindingMode('OneWay');
        this.setModel(oVHModel, 'valueHelp');
      }
    });
  }
);
