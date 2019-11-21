sap.ui.define(['sap/m/Button', 'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle'], function(Button, bundle) {
  'use strict';

  return Button.extend('com.sap.cd.maco.mmt.ui.reuse.control.button.Share', {
    init: function() {
      this.setIcon('sap-icon://action');
      this.setType('Transparent');
      this.setTooltip(bundle.getText('buttonShareTooltip'));
    },

    renderer: {}
  });
});
