sap.ui.define(['sap/m/Button'], function(Button) {
  'use strict';

  return Button.extend('com.sap.cd.maco.mmt.ui.reuse.objectPage.draft.DraftStatus', {
    init: function() {
      this.setType('Transparent');
      this.setIcon('sap-icon://user-edit');
      this.bindProperty('visible', {
        path: 'HasDraftEntity'
      });
    },

    renderer: {}
  });
});
