sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(Object, Assert) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.action.ActionArgsInterpretation', {
    constructor: function() {},

    getArgs: function(aArguments) {
      if (typeof aArguments[0] === 'string') {
        Assert.ok(aArguments[1], 'cannot interpret action args. no event as second parameter');
        return {
          name: aArguments[0],
          event: aArguments[1]
        };
      } else {
        var oSource = aArguments[0].getSource();
        var sName = oSource.data('action');
        Assert.ok(sName, 'cannot interpret action args. missing custom data with key "action"');
        return {
          name: sName,
          event: aArguments[0]
        };
      }
    }
  });
});
