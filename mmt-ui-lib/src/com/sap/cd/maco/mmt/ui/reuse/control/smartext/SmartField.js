sap.ui.define(['sap/ui/comp/smartfield/SmartField', 'sap/ui/comp/smartfield/Configuration'], function(SmartField, Configuration) {
  'use strict';

  return SmartField.extend('com.sap.cd.maco.mmt.ui.reuse.control.smartext.SmartField', {
    renderer: {},

    metadata: {},

    init: function() {
      SmartField.prototype.init.apply(this, arguments);
      this.setConfiguration(
        new Configuration({
          displayBehaviour: 'idAndDescription',
          preventInitialDataFetchInValueHelpDialog: false
        })
      );
    }
  });
});
