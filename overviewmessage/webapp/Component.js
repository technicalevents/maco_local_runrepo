sap.ui.define([
	"sap/ovp/app/Component"
], function(Component) {
  'use strict';

  return Component.extend('com.sap.cd.maco.monitor.ui.app.overviewmessages.Component', {
    metadata: {
      manifest: 'json'
    },

    init: function() {
      Component.prototype.init.apply(this, arguments);
    },

    destroy: function() {
      Component.prototype.destroy.apply(this, arguments);
    }
  });
});
