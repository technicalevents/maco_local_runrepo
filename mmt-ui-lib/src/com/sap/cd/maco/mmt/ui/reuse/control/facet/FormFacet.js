sap.ui.define(
  ['sap/ui/core/XMLComposite'],
  function(XMLComposite) {
    'use strict';

    return XMLComposite.extend('com.sap.cd.maco.mmt.ui.reuse.control.facet.FormFacet', {
      metadata: {
        aggregations: {
          fields: {
            type: 'sap.ui.core.Control',
            invalidate: true,
            multiple: true,
            forwarding: {
              idSuffix: '--layout',
              aggregation: 'items'
            }
          }
        },
        defaultAggregation: 'fields'
      },

      init: function() {
        // default XMLComposite properties to avoid block display
        this.setDisplayBlock(false);
        this.setWidth('');
        this.addStyleClass('comSapCdMacoMmtUiReuseFormFacet');
      }
    });
  },
  /* bExport= */ true
);
