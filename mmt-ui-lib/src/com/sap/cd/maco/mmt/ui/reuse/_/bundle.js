sap.ui.define([], function() {
  'use strict';

  /**
   * The goal of this file is to abstract on how the resource bundle is accessed.
   * This differs if the reuse code runs in a real reuse lib or is copied to an app.
   */
  return {
    get: function() {
      return sap.ui.getCore().getLibraryResourceBundle('com.sap.cd.maco.mmt.ui.reuse');
    }
  };
});
