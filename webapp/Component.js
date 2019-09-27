sap.ui.define(
  [
    "sap/ui/core/UIComponent",
    "com/sap/cd/maco/mmt/ui/reuse/bootstrap/BootstrapMmt",
    "com/sap/cd/maco/mmt/ui/reuse/nav/HashSync"
  ],
  function(UIComponent, Bootstrap, HashSync) {
    "use strict";

    return UIComponent.extend("com.sap.cd.maco.monitor.ui.app.displayprocesses.Component", {
      metadata: {
        manifest: "json"
      },

      /**
       * Function is used to initialize Component
       */
      init: function() {
        // call the base component"s init function
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
            return "processPage";
          }
        });
        oHashSync.synch();

        // create the views based on the url/hash
        this.getRouter().initialize();
      },

      /**
       * Function is triggered on exit of Application 
       */
      destroy: function() {
        // generic destroy of component
        this._oBootstrap.destroyComponent();

        // call the base component's destroy function
        UIComponent.prototype.destroy.apply(this, arguments);
      },
      
      /**
		 * Function is used to get Message Model from Message Managewr
		 * @pubic
		 * @returns {object}     Message Model
		 */
		getMessageManager: function() {
			if(!this._oMessageManager) {
				this._oMessageManager = sap.ui.getCore().getMessageManager();
			}
			return this._oMessageManager;
		}
    });
  }
);
