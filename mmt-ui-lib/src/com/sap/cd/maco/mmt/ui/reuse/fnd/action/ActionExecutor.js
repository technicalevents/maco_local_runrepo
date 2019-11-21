sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(Object, Assert) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.action.ActionExecutor', {
    constructor: function() {},

    execute: function(oParams) {
      this._checkParams(oParams);
      this._executeAction(oParams);
    },

    _checkParams: function(oParams) {
      Assert.ok(oParams, 'cannot execute action. no params');
      Assert.ok(oParams.controller, 'cannot execute action. no controller param');
      Assert.ok(oParams.action, 'cannot execute action. no action param');
      Assert.ok(oParams.name, 'cannot execute action. no name param');
      Assert.ok(oParams.event, 'cannot execute action. no event param');
      Assert.ok(oParams.params, 'cannot execute action. no params param');
    },

    _executeAction: function(oParams) {
      this._callOnBefore(oParams);
      oParams.action.execute(oParams.params).then(
        function(oResult) {
          this._callOnAfter(oParams, oResult);
        }.bind(this),
        function(e) {
          // output errors to the console
          if (e instanceof Error) {
            throw e;
          }
        }
      );
    },

    _callOnBefore: function(oParams) {
      var sBeforeFunc = 'onBeforeAction' + this._capitalize(oParams.name);
      if (oParams.controller[sBeforeFunc]) {
        oParams.controller[sBeforeFunc](oParams.params);
      }
    },

    _callOnAfter: function(oParams, oResult) {
      var sAfterFunc = 'onAfterAction' + this._capitalize(oParams.name);
      if (oParams.controller[sAfterFunc]) {
        oParams.controller[sAfterFunc](oResult, oParams.params);
      }
    },

    _capitalize: function(sString) {
      return sString.charAt(0).toUpperCase() + sString.slice(1);
    }
  });
});
