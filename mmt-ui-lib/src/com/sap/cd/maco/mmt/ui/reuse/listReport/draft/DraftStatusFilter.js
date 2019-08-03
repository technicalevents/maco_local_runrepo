sap.ui.define(
  ['sap/ui/core/XMLComposite'],
  function(XMLComposite) {
    'use strict';

    return XMLComposite.extend('com.sap.cd.maco.mmt.ui.reuse.listReport.draft.DraftStatusFilter', {
      metadata: {
        properties: {
          selectedKey: { type: 'string', defaultValue: 'all' }
        },
        events: {
          change: {
            parameters: {
              selectedItem: 'sap.ui.core.Item'
            }
          }
        }
      },
      onChange: function(oEvent) {
        var oSelectedItem = oEvent.getParameter('selectedItem');
        this.fireEvent('change', { selectedItem: oSelectedItem });
      }
    });
  },
  /* bExport= */ true
);
