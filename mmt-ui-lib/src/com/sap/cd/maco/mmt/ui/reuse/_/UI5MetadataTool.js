sap.ui.define(['sap/ui/base/Object'], function(Object) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse._.UI5MetadataTool', {
    constructor: function() {},

    isInstance: function(oObject, sClassName) {
      var bResult = oObject && oObject.getMetadata && oObject.getMetadata().getName() === sClassName;
      return bResult;
    },

    isSubclass: function(oObject, sClassName) {
      var oMeta = oObject.getMetadata();
      while (oMeta) {
        var sName = oMeta.getName();
        if (sName === sClassName) {
          return true;
        }
        oMeta = oMeta.getParent();
      }
      return false;
    },

    hasParentWithSubclass: function(oObject, sClassName) {
      var oParent = oObject.getParent();
      while (oParent) {
        var bMatch = this.isSubclass(oParent, sClassName);
        if (bMatch) {
          return true;
        }
        oParent = oParent.getParent();
      }
      return false;
    }
  });
});
