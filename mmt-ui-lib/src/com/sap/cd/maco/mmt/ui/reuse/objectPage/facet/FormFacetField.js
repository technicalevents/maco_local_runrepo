sap.ui.define(
  ['sap/ui/core/XMLComposite'],
  function(XMLComposite) {
    'use strict';

    return XMLComposite.extend('com.sap.cd.maco.mmt.ui.reuse.objectPage.facet.FormFacetField', {
      metadata: {
        properties: {
          label: { invalidate: true, type: 'string', defaultValue: '' },
          text: { invalidate: true, type: 'string', defaultValue: '' },
          type: { invalidate: true, type: 'string', defaultValue: 'Text' },
          state: { invalidate: true, type: 'string', defaultValue: 'None' }
        },
        events: {
          press: {}
        }
      },

      _onPress: function(oEvent) {
        this.fireEvent('press');
      },

      _showText: function(sType) {
        return 'Text' === sType;
      },

      _showLink: function(sType) {
        return 'Link' === sType;
      },

      _showStatus: function(sType) {
        return 'Status' === sType;
      }
    });
  },
  /* bExport= */ true
);
