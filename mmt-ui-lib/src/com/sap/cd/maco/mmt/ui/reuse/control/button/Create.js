sap.ui.define(['sap/m/Button', 'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle'], function(Button, bundle) {
  'use strict';

  return Button.extend('com.sap.cd.maco.mmt.ui.reuse.control.button.Create', {
    init: function() {
      this.setIcon('sap-icon://add');
      this.setTooltip(bundle.getText('buttonCreateTooltip'));
    },

    renderer: {}
  });
});
