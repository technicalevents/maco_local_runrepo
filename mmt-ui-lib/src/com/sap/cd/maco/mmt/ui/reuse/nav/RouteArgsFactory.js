sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/base/BaseObject'], function(BaseObject) {
  'use strict';

  return BaseObject.extend('com.sap.cd.maco.mmt.ui.reuse.nav.RouteArgsFactory', {
    constructor: function(oComponent) {
      BaseObject.apply(this, arguments);
    },

    fromObject: function(sRoute, oObject) {
      this.oAssert.ok(sRoute, 'cannot create route params. the route is undefined');
      this.oAssert.ok(oObject, 'cannot create route params. the object is undefined');

      // get route
      var oRoute = this.oRouter.getRoute(sRoute);
      this.oAssert.ok(oRoute, 'cannot create route params. route ' + sRoute + ' is unknown to the route');

      // iterate object properties and find route args
      var oArgs = {};
      var sPattern = oRoute.getPattern();
      for (var sKey in oObject) {
        var sRouteParam = '{' + sKey + '}';
        if (sPattern.indexOf(sRouteParam) !== -1) {
          oArgs[sKey] = oObject[sKey];
          sPattern = sPattern.replace(sRouteParam, oObject[sKey]);
        }
      }

      // all replaced?
      this.oAssert.ok(
        sPattern.indexOf('{') === -1,
        'cannot create route params for route ' + sRoute + '. not all params have been replaced by object properties: ' + sPattern
      );

      return oArgs;
    }
  });
});
