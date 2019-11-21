/*global location*/
sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/fnd/action/FragmentAction', 'com/sap/cd/maco/mmt/ui/reuse/fnd/base/_/copy'], function(
  FragmentAction,
  copy
) {
  'use strict';

  return FragmentAction.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.base.BaseFragmentAction', {
    constructor: function() {
      // super
      FragmentAction.apply(this, arguments);

      // copy properties from component
      var oComponent = arguments[0];
      copy(oComponent, this);
    }
  });
});
