sap.ui.define(['sap/m/Button', 'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle'], function(Button, bundle) {
  'use strict';

  return Button.extend('com.sap.cd.maco.mmt.ui.reuse.control.button.Reject', {
    init: function() {
      this.setText(bundle.getText('buttonReject'));
      this.setType('Reject');
    },

    renderer: {}
  });
});
