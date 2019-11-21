sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(Assert) {
  'use strict';

  return {
    fromObject: function(oRouter, sRoute, oObject) {
      this._checkParams(oRouter, sRoute, oObject);
      var sPattern = this._getPattern(oRouter, sRoute);
      var oArgs = this._getArgs(sRoute, sPattern, oObject);
      return oArgs;
    },

    _checkParams: function(oRouter, sRoute, oObject) {
      Assert.ok(oRouter, 'cannot create route params. the router is undefined');
      Assert.ok(sRoute, 'cannot create route params. the route is undefined');
      Assert.ok(oObject, 'cannot create route params. the object is undefined');
    },

    _getPattern: function(oRouter, sRoute) {
      var oRoute = oRouter.getRoute(sRoute);
      Assert.ok(oRoute, 'cannot create route params. route ' + sRoute + ' has not been found');
      var sPattern = oRoute.getPattern();
      return sPattern;
    },

    _getArgs: function(sRoute, sPattern, oObject) {
      var oArgs = {};

      // iterate object properties
      for (var sKey in oObject) {
        var sRouteParam = '{' + sKey + '}';
        if (sPattern.indexOf(sRouteParam) !== -1) {
          oArgs[sKey] = oObject[sKey];
          sPattern = sPattern.replace(sRouteParam, oObject[sKey]);
        }
      }

      // all replaced?
      Assert.ok(
        sPattern.indexOf('{') === -1,
        'cannot create route params for route ' + sRoute + '. not all params have been replaced by object properties: ' + sPattern
      );

      return oArgs;
    }
  };
});
