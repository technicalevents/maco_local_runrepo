sap.ui.define(
  ['sap/ui/core/XMLComposite', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle'],
  function(XMLComposite, bundle) {
    'use strict';

    return XMLComposite.extend('com.sap.cd.maco.mmt.ui.reuse.table.ObjectIdentifier', {
      metadata: {
        properties: {
          title: { invalidate: true, type: 'string', defaultValue: '' },
          text: { invalidate: true, type: 'string', defaultValue: '' }
        },
        events: {}
      },

      _visible: function(sValue) {
        return !!sValue;
      },

      _unknownVisible: function(sTitle, sText) {
        return !sTitle && !sText;
      },

      _unknownText: function() {
        return '<cite>&lt;' + bundle.get().getText('tableObjectIdUnamed') + '&gt;</cite>';
      }
    });
  },
  /* bExport= */ true
);
