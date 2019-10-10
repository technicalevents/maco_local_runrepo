/*global location*/
sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/_/bundle'], function(bundle) {
  'use strict';

  return function(oBaseObject, oConfig, sKey, sDefault, oObject) {
    if (!oConfig || !oConfig[sKey]) {
      // empty
      return bundle.get().getText(sDefault);
    } else if (typeof oConfig[sKey] === 'string') {
      // string
      var sResult = oBaseObject.oBundle.getText(oConfig[sKey]);
      oBaseObject.oAssert.ok(sResult !== oConfig[sKey], 'the key ' + oConfig[sKey] + ' does not exist in the apps i18n file');
      return sResult;
    } else if ({}.toString.call(oConfig[sKey]) === '[object Function]') {
      // function!
      if (oObject) {
        return oConfig[sKey](oObject);
      } else {
        return oConfig[sKey]();
      }
    } else {
      oBaseObject.oAssert.ok(false, 'cannot get text. type of ' + sKey + ' is not supported: ' + typeof oConfig[sKey]);
    }
  };
});
