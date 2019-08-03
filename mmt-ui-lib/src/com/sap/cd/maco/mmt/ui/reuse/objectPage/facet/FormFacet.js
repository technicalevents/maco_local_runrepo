sap.ui.define(
  ['sap/ui/core/XMLComposite'],
  function(XMLComposite) {
    'use strict';

    return XMLComposite.extend('com.sap.cd.maco.mmt.ui.reuse.objectPage.facet.FormFacet', {
      metadata: {
        aggregations: {
          fields: {
            type: 'com.sap.cd.maco.mmt.ui.reuse.objectPage.facet.FormFacetField',
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
      }
    });
  },
  /* bExport= */ true
);
