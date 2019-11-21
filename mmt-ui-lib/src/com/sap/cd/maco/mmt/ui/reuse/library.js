/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library sap.cd.maco.mmt.ui.
 */
sap.ui.define(
  ['jquery.sap.global', 'sap/ui/core/library'], // library dependency
  function(jQuery) {
    'use strict';

    /**
     *  UI library
     *
     * @namespace
     * @name sap.cd.maco.mmt.ui
     * @author SAP SE
     * @version ${version}
     * @public
     */

    // delegate further initialization of this library to the Core
    sap.ui.getCore().initLibrary({
      name: 'com.sap.cd.maco.mmt.ui.reuse',
      version: '1.0.0',
      dependencies: ['sap.ui.core'],
      types: [],
      interfaces: [],
      controls: [],
      elements: []
    });
  }
);
