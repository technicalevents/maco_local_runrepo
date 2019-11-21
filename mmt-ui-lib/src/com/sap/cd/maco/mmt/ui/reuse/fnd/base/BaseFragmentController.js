sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/FragmentController',
    'com/sap/cd/maco/mmt/ui/reuse/mmt/valueHelpFormatter',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/_/copy',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/action/ActionExecutor',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/action/ActionArgsInterpretation',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/action/ActionResolution',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/action/ActionParams'
  ],
  function(FragmentController, valueHelpFormatter, copy, ActionExecutor, ActionArgsInterpretation, ActionResolution, ActionParams) {
    'use strict';

    return FragmentController.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.base.BaseFragmentController', {
      valueHelpFormatter: valueHelpFormatter,

      constructor: function(params) {
        FragmentController.call(this, params);
      },

      onInit: function(oConfig) {
        if (oConfig) {
          this.oConfig = oConfig;
        }

        this.oComponent = this.getOwnerComponent();

        // some strange effects with cross app nav
        // old route will be fired on triggering app (FLP bug) ... but getOwnerComponent does not work anymore
        if (!this.oComponent) {
          jQuery.sap.log.error('BaseFragmentController onInit without owner component: ' + this.getMetadata().getName());
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
        var oModel = this.getFragment().getModel('this');
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

      onAction: function() {
        var oArgs = new ActionArgsInterpretation().getArgs(arguments);
        var oAction = new ActionResolution().getAction(this, oArgs.name);
        var oParams = new ActionParams().getParams(this, oArgs.event);
        if (!this._oActionExecutor) {
          this._oActionExecutor = new ActionExecutor();
        }
        this._oActionExecutor.execute({
          controller: this,
          action: oAction,
          name: oArgs.name,
          event: oArgs.event,
          params: oParams
        });
      }
    });
  }
);
