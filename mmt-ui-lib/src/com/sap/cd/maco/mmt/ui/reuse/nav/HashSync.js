/* eslint-disable sap-no-absolute-component-path */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'sap/ui/core/routing/HashChanger'], function(jQuery, Object, HashChanger) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.nav.HashSync', {
    constructor: function(params) {
      // check params
      if (!params) {
        throw new Error('missing params');
      }
      if (!params.component) {
        throw new Error('missing param: component');
      }
      if (!params.message) {
        throw new Error('missing param: message');
      }
      if (!params.getRouteName) {
        // ok, optional
      }

      this._component = params.component;
      this._message = params.message;
      this._getRouteName = params.getRouteName;
    },

    synch: function() {
      // abort if the hash is already set
      // (this is considered stronger than startup parameter)
      var oHashChanger = HashChanger.getInstance();
      var sCurrentHash = oHashChanger.getHash();
      if (sCurrentHash) {
        return;
      }

      // get component data
      var oComponentData = this._component.getComponentData();
      if (!oComponentData) {
        jQuery.sap.log.error('failed to sync hash. missing component data');
        return;
      }
      var startupParams = oComponentData.startupParameters;
      if (!startupParams) {
        jQuery.sap.log.error('failed to sync hash. missing startupParameters');
        return;
      }

      // get route name
      var sRouteName;
      var fnGetRoute = this._getRouteName ? this._getRouteName : this._getRouteNameDefault;
      try {
        sRouteName = fnGetRoute(startupParams);
      } catch (e) {
        sRouteName = null;
      }
      if (!sRouteName) {
        jQuery.sap.log.error('failed to sync hash. route name has not been determined');
        return;
      }

      // get route
      var oRoute = this._component.getRouter().getRoute(sRouteName);
      if (!oRoute) {
        jQuery.sap.log.error('failed to sync hash. no route for routeName ' + sRouteName);
        return;
      }

      // replace all startup parameter in the route pattern
      var sPattern = oRoute.getPattern();
      for (var sParamName in startupParams) {
        if (Array.isArray(startupParams[sParamName]) && startupParams[sParamName].length === 1) {
          var sParamValue = startupParams[sParamName][0];
          var sRouteParam = '{' + sParamName + '}';
          if (sPattern.indexOf(sRouteParam) !== -1) {
            sPattern = sPattern.replace(sRouteParam, sParamValue);
          }
          var sRouteParamOptional = ':' + sParamName + ':';
          if (sPattern.indexOf(sRouteParamOptional) !== -1) {
            sPattern = sPattern.replace(sRouteParamOptional, sParamValue);
          }
        }
      }

      // check if all params have been replaced
      if (sPattern.indexOf('{') !== -1 || sPattern.indexOf('}') !== -1) {
        jQuery.sap.log.error('Hash Sync failed. Not all route parameters are available as startup parameters: ' + sPattern);
        return;
      }

      // finally replace hash
      oHashChanger.replaceHash(sPattern);
    },

    _getRouteNameDefault: function(oStartupParams) {
      if (!oStartupParams.route || !Array.isArray(oStartupParams.route) || oStartupParams.route.length === 0) {
        return null;
      } else {
        return oStartupParams.route[0];
      }
    }
  });
});
