/*global location*/
sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/fnd/action/Action', 'com/sap/cd/maco/mmt/ui/reuse/fnd/base/_/copy'], function(Action, copy) {
  'use strict';

  return Action.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.base.BaseAction', {
    constructor: function(oComponent, oConfig, sCardinality) {
      // super
      Action.call(this, oConfig, sCardinality);

      // copy properties from component
      copy(oComponent, this);
    }
  });
});
