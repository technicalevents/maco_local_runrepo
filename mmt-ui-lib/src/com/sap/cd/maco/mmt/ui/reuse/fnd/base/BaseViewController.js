sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/action/ActionController',
    'com/sap/cd/maco/mmt/ui/reuse/mmt/valueHelpFormatter',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/_/copy'
  ],
  function(ActionController, valueHelpFormatter, copy) {
    'use strict';

    return ActionController.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.base.BaseViewController', {
      valueHelpFormatter: valueHelpFormatter,

      onInit: function(oConfig) {
        // super
        ActionController.prototype.onInit.apply(this, arguments);

        // store config
        if (oConfig) {
          this.oConfig = oConfig;
        }

        this.oComponent = this.getOwnerComponent();

        // some strange effects with cross app nav
        // old route will be fired on triggering app (FLP bug) ... but getOwnerComponent does not work anymore
        if (!this.oComponent) {
          jQuery.sap.log.error('BaseViewController onInit without owner component: ' + this.getMetadata().getName());
          return;
        }

        // copy properties from component
        copy(this.oComponent, this);

        // register
        if (this.oComponent.oControllerRegistry) {
          this.oComponent.oControllerRegistry.register(this);
        }
      },

      getThisModel: function() {
        var oModel = this.getView().getModel('this');
        if (!oModel) {
          throw new Error('no model with name this on controller: ' + this);
        }
        return oModel;
      },

      replace: function(sString, oObject) {
        for (var sKey in oObject) {
          sString = sString.replace('{' + sKey + '}', oObject[sKey]);
        }
        return sString;
      },

      attachParentContextChange: function(fnCallback) {
        var oView = this.getView();
        oView.attachModelContextChange(this._onModelContextChange, this);
        this._sParentPath = null;
        this._fnParentContextChange = fnCallback;
      },

      _onModelContextChange: function(oEvent) {
        // get parent
        var oParent = this.getView().getParent();
        if (!oParent) {
          return;
        }

        // fire event only if parent path has changed
        var oContext = oParent.getBindingContext();
        var sParentPath = oContext ? oContext.getPath() : null;
        if (sParentPath && sParentPath !== this._sParentPath) {
          this._fnParentContextChange(oContext);
          this._sParentPath = sParentPath;
        }
      }
    });
  }
);
