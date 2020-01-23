/*global location*/
sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert', 'com/sap/cd/maco/mmt/ui/reuse/fnd/getConfigText'], function(
  Object,
  Assert,
  getConfigText
) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.action.Action', {
    constructor: function(oConfig, sCardinality) {
      this.oConfig = oConfig ? oConfig : {};
      Assert.ok(
        sCardinality === '0' || sCardinality === '1' || sCardinality === '1..N' || sCardinality === '2..N'|| sCardinality === '1..35',
        'cannot instantiate base action. cardinality must be 0, 1, 1..N, 2..N or 1..35'
      );
      this._sCardinality = sCardinality;
    },

    cardinality: function() {
      return this._sCardinality;
    },

    execute: function(params) {
      Assert.ok(false, 'cannot execute. subclasser of BaseAction has not overriden execute');
    },

    getConfigText: function(sKey, sDefault, oObject) {
      return getConfigText(this, this.oConfig, sKey, sDefault, oObject);
    },

    assertContextParam: function(oParams) {
      Assert.ok(oParams, 'invalid action. no oParams');
      Assert.ok(oParams.contexts, 'invalid action. no contexts');
      Assert.array(oParams.contexts, 'invalid action. contexts is no array');
      Assert.ok(oParams.contexts.length > 0, 'invalid action. contexts is empty');
      Assert.ok(oParams.contexts[0], 'invalid action. contexts contains an empty context');
    }
  });
});
