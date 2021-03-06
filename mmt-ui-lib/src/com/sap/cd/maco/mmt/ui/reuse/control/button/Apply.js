sap.ui.define(['sap/m/Button', 'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle'], function(Button, bundle) {
  'use strict';

  return Button.extend('com.sap.cd.maco.mmt.ui.reuse.control.button.Apply', {
    init: function() {
      this.setText(bundle.getText('buttonApply'));
      this.setType('Emphasized');
    },

    renderer: {}
  });
});
