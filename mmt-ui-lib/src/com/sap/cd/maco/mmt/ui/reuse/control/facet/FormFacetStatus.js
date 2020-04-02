sap.ui.define(
  ['sap/ui/core/XMLComposite'],
  function(XMLComposite) {
    'use strict';

    return XMLComposite.extend('com.sap.cd.maco.mmt.ui.reuse.control.facet.FormFacetStatus', {
      metadata: {
        properties: {
          label: { invalidate: true, type: 'string', defaultValue: '' },
          text: { invalidate: true, type: 'string', defaultValue: '' },
          state: { invalidate: true, type: 'string', defaultValue: 'None' },
          icon: { invalidate: true, type: 'string', defaultValue: '' },
          inverted: { invalidate: true, type: 'boolean', defaultValue: false }
        }
      }
    });
  },
  /* bExport= */ true
);
