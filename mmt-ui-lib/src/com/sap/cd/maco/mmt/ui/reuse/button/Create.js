sap.ui.define(['sap/m/Button', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle'], function(Button, bundle) {
  'use strict';

  return Button.extend('com.sap.cd.maco.mmt.ui.reuse.button.Create', {
    init: function() {
      this.setIcon('sap-icon://add');
    },

    renderer: {}
  });
});
