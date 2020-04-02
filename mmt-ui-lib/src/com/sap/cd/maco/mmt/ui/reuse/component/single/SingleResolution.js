sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(Assert) {
  'use strict';

  /**
   * This artefact has a dependency to the property "mSingles" of the "BaseComponent".
   */
  return {
    get: function(sName, oObject, bSuppressCheck) {
      var mSingles = this._findSingles(oObject);
      if (!bSuppressCheck) {
        this._checkSingles(mSingles, sName, oObject);
      }
      return mSingles ? mSingles[sName] : null;
    },

    _findSingles: function(oObject) {
      var mSingles;
      if (!!oObject.mSingles) {
        mSingles = oObject.mSingles;
      } else if (oObject.component) {
        mSingles = oObject.component.mSingles;
      } else if (oObject.getOwnerComponent) {
        mSingles = oObject.getOwnerComponent().mSingles;
      }
      return mSingles;
    },

    _checkSingles: function(mSingles, sName, oObject) {
      Assert.ok(mSingles, 'cannot find single ' + sName + '. cannot find singles for object ' + oObject);
      Assert.ok(mSingles[sName], 'cannot find single ' + sName + ' on component');
    }
  };
});
