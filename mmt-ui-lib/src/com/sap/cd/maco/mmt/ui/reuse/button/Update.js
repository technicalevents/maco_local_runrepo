sap.ui.define(['sap/m/Button', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle'], function(Button, bundle) {
  'use strict';

  return Button.extend('com.sap.cd.maco.mmt.ui.reuse.button.Update', {
    init: function() {
      this.setText(bundle.get().getText('buttonUpdate'));
    },

    renderer: {}
  });
});
