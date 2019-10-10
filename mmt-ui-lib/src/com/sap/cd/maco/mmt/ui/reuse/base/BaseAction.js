/*global location*/
sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/base/BaseObject', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle', 'com/sap/cd/maco/mmt/ui/reuse/_/getConfigText'],
  function(BaseObject, bundle, getConfigText) {
    'use strict';

    return BaseObject.extend('com.sap.cd.maco.mmt.ui.reuse.base.BaseAction', {
      constructor: function(oComponent, oConfig, sCardinality) {
        BaseObject.call(this, oComponent);
        this.oConfig = oConfig ? oConfig : {};
        /*
        TODO next
        this.oAssert.ok(
          sCardinality === '0' || sCardinality === '1' || sCardinality === 'N',
          'cannot instantiate base action. cardinality must be 0, 1 or N'
        );
        */
        this._sCardinality = sCardinality;
      },

      enabled: function(context) {
        return true;
      },

      visible: function(context) {
        return true;
      },

      cardinality: function() {
        return this._sCardinality;
      },

      execute: function(params) {
        this.oAssert.ok(false, 'cannot execute. subclasser of BaseAction has not overriden execute');
      },

      getConfigText: function(sKey, sDefault, oObject) {
        return getConfigText(this, this.oConfig, sKey, sDefault, oObject);
      },

      assertContextParam: function(oParams) {
        this.oAssert.ok(oParams, 'cannot execute action. no oParams');
        this.oAssert.ok(oParams.contexts, 'cannot execute action. no contexts');
        this.oAssert.array(oParams.contexts, 'cannot execute action. contexts is no array');
        this.oAssert.ok(oParams.contexts.length > 0, 'cannot execute action. contexts is empty');
        this.oAssert.ok(oParams.contexts[0], 'cannot execute action. contexts contains an empty context');
      }
    });
  }
);
