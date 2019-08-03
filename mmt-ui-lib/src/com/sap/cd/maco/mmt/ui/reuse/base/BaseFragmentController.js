sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/base/FragmentController',
    'com/sap/cd/maco/mmt/ui/reuse/mmt/valueHelpFormatter',
    'com/sap/cd/maco/mmt/ui/reuse/base/_/copy'
  ],
  function(FragmentController, valueHelpFormatter, copy) {
    'use strict';

    return FragmentController.extend('com.sap.cd.maco.mmt.ui.reuse.base.BaseFragmentController', {
      valueHelpFormatter: valueHelpFormatter,

      constructor: function(params) {
        FragmentController.call(this, params);
      },

      onInit: function() {
        this.oComponent = this.getOwnerComponent();

        // some strange effects with cross app nav
        // old route will be fired on triggering app (FLP bug) ... but getOwnerComponent does not work anymore
        if (!this.oComponent) {
          jQuery.sap.log.error('BaseFragmentController onInit without owner component: ' + this.getMetadata().getName());
          return;
        }

        // copy properties from component
        copy(this.oComponent, this);
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
      }
    });
  }
);
