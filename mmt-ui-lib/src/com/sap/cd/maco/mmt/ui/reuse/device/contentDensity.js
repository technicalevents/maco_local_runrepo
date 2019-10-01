sap.ui.define(['jquery.sap.global', 'sap/ui/Device'], function(jQuery, Device) {
  'use strict';

  return {
    /**
     * Determines whether the sapUiSizeCompact or sapUiSizeCozy
     * design mode class should be set, which influences the size appearance of some controls.
     * @public
     * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
     */
    get: function() {
      // check whether FLP has already set the content density class; do nothing in this case
      if (jQuery(document.body).hasClass('sapUiSizeCozy') || jQuery(document.body).hasClass('sapUiSizeCompact')) {
        return '';
      } else if (!Device.support.touch) {
        // apply "compact" mode if touch is not supported
        return 'sapUiSizeCompact';
      } else {
        // "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
        return 'sapUiSizeCozy';
      }
    }
  };
});
