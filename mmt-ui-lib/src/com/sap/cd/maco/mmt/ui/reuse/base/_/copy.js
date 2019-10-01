sap.ui.define([], function() {
  'use strict';

  return function(oComponent, oTarget) {
    // standard references
    oTarget.oComponent = oComponent;
    oTarget.oModel = oComponent.getModel();
    oTarget.oRouter = oComponent.getRouter();

    // check base properties
    oComponent.oAssert.ok(oComponent.baseProperties, 'cannot copy base properties. No baseProperties set on component');
    oComponent.oAssert.array(oComponent.baseProperties, 'cannot copy base properties. baseProperties is not an array');

    // copy base properties
    for (var i = 0; i < oComponent.baseProperties.length; i++) {
      var sProperty = oComponent.baseProperties[i];
      if (oComponent.hasOwnProperty(sProperty)) {
        oTarget[sProperty] = oComponent[sProperty];
      } else {
        oComponent.oAssert.ok(false, 'base property is declared but not set on component: ' + sProperty);
      }
    }
  };
});
