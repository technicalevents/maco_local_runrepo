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
      
      this.getModel("MessageMonitor").setSizeLimit(1500);
    },

    destroy: function() {
      Component.prototype.destroy.apply(this, arguments);
    }
  });
});
