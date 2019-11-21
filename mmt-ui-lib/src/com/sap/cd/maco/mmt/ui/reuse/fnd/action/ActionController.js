sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/action/ActionExecutor',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/action/ActionArgsInterpretation',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/action/ActionResolution',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/action/ActionParams'
  ],
  function(Controller, ActionExecutor, ActionArgsInterpretation, ActionResolution, ActionParams) {
    'use strict';

    return Controller.extend('com.sap.cd.maco.mmt.ui.reuse.action.ActionController', {
      onInit: function() {},

      onAction: function() {
        var oArgs = new ActionArgsInterpretation().getArgs(arguments);
        var oAction = new ActionResolution().getAction(this, oArgs.name);
        var oParams = new ActionParams().getParams(this, oArgs.event);
        var oExecution = {
          controller: this,
          action: oAction,
          name: oArgs.name,
          event: oArgs.event,
          params: oParams
        };
        new ActionExecutor().execute(oExecution);
      }
    });
  }
);
