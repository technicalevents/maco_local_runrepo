sap.ui.define([], function() {
  'use strict';

  return {
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
  };
});
