sap.ui.define(
  ['sap/ui/core/XMLComposite', 'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle'],
  function(XMLComposite, bundle) {
    'use strict';

    return XMLComposite.extend('com.sap.cd.maco.mmt.ui.reuse.control.table.ObjectIdentifier', {
      metadata: {
        properties: {
          title: { invalidate: true, type: 'string', defaultValue: '' },
          text: { invalidate: true, type: 'string', defaultValue: '' },
          noDataText: { invalidate: true, type: 'string', defaultValue: '&lt;' + bundle.getText('controlTableObjectIdentifierNoData') + '&gt;' }
        },
        events: {}
      },

      _visible: function(sValue) {
        return !!sValue;
      },

      _noDataVisible: function(sTitle, sText) {
        return !sTitle && !sText;
      }
    });
  },
  /* bExport= */ true
);
