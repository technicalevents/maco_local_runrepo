sap.ui.define(['sap/m/ColumnListItem'], function(ColumnListItem) {
  'use strict';

  return ColumnListItem.extend('com.sap.cd.maco.mmt.ui.reuse.listReport.draft.DraftColumnListItem', {
    getHighlight: function() {
      var oObject = this.getBindingContext().getObject();
      if (oObject && !oObject.HasActiveEntity && !oObject.HasDraftEntity && !oObject.IsActiveEntity) {
        return 'Information';
      } else {
        return 'None';
      }
    },

    renderer: {}
  });
});
