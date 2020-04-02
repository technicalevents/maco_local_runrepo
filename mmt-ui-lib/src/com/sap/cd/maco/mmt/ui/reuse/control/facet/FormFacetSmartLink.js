sap.ui.define(
  ['sap/ui/core/XMLComposite'],
  function(XMLComposite) {
    'use strict';

    return XMLComposite.extend('com.sap.cd.maco.mmt.ui.reuse.control.facet.FormFacetSmartLink', {
      metadata: {
        properties: {
          label: { invalidate: true, type: 'string', defaultValue: '' },
          text: { invalidate: true, type: 'string', defaultValue: '' },
          semanticObject: { invalidate: true, type: 'string', defaultValue: '' }
        },
        events: {
          beforePopoverOpens: {}
        }
      },

      _onBeforePopoverOpens: function(oEvent) {
        this.fireEvent('beforePopoverOpens');
      }
    });
  },
  /* bExport= */ true
);
