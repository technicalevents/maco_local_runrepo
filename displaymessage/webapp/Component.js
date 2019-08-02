sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "com/sap/cd/maco/mmt/ui/reuse/bootstrap/BootstrapMmt",
    "com/sap/cd/maco/mmt/ui/reuse/nav/HashSync"
  ],
  function(UIComponent, Bootstrap, HashSync) {
    'use strict';

    return UIComponent.extend('com.sap.cd.maco.monitor.ui.app.displaymessages.Component', {
      metadata: {
        manifest: 'json'
      },

      /**
       * Function is used to initialize Component
       */
      init: function() {
        // call the base component's init function
        UIComponent.prototype.init.apply(this, arguments);

        // generic init of component
        this._oBootstrap = new Bootstrap(this);
        this._oBootstrap.initComponent();

        this.initRouting();
      },

      /**
       * Function is used to initialize Router
       */
      initRouting: function() {
        // sync hash
        var oHashSync = new HashSync({
          component: this,
          message: this.oMessage,
          getRouteName: function(startupParams) {
            return 'messagePage';
          }
        });
        oHashSync.synch();

        // create the views based on the url/hash
        this.getRouter().initialize();
      },

      /**
       * Function is used to destroy component
       */
      destroy: function() {
        // generic destroy of component
        this._oBootstrap.destroyComponent();

        // call the base component's destroy function
        UIComponent.prototype.destroy.apply(this, arguments);
      }
    });
  }
);
