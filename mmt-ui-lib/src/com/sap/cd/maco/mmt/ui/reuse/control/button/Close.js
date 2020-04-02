sap.ui.define(['sap/m/Button', 'com/sap/cd/fom/manage/reuse/fnd/bundle'], function(Button, bundle) {
  'use strict';

  return Button.extend('com.sap.cd.maco.mmt.ui.reuse.control.button.Close', {
    init: function() {
      this.setIcon('sap-icon://decline');
      this.setType('Transparent');
      this.setTooltip(bundle.getText('buttonCloseTooltip'));
    },

    renderer: {}
  });
});
