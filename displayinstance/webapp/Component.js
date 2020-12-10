sap.ui.define(
  [
    "sap/ui/core/UIComponent"
  ],
  function(UIComponent) {
    "use strict";

    return UIComponent.extend("com.sap.cd.us4g.DisplayInstance.Component", {
      metadata: {
        manifest: "json"
      },

      init: function() {
        // super
        UIComponent.prototype.init.apply(this, arguments);

        // create the views based on the url/hash
        this.getRouter().initialize();
      },

      exit: function() {
        // super
        UIComponent.prototype.exit.apply(this, arguments);
      }
    });
  }
);