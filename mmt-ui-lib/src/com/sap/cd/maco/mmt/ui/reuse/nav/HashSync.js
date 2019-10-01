/* eslint-disable sap-no-absolute-component-path */
sap.ui.define(['jquery.sap.global', 'com/sap/cd/maco/mmt/ui/reuse/base/BaseObject', 'sap/ui/core/routing/HashChanger'], function(
  jQuery,
  BaseObject,
  HashChanger
) {
  'use strict';

  return BaseObject.extend('com.sap.cd.maco.mmt.ui.reuse.nav.HashSync', {
    constructor: function(params) {
      BaseObject.call(this, params.component);

      // check params
      this.oAssert.ok(params.routeName || params.getRouteName, 'Cannot init HashSync. routeName or getRouteName must be set');
      this.oAssert.ok(!(params.routeName && params.getRouteName), 'Cannot init HashSync. you cannot use both routeName and getRouteName');

      this._sRouteName = params.routeName;
      this._fnGetRouteName = params.getRouteName;
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
      var oComponentData = this.oComponent.getComponentData();
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
      if (!this._sRouteName) {
        try {
          this._sRouteName = this._fnGetRouteName(startupParams);
        } catch (e) {}
        if (!this._sRouteName) {
          jQuery.sap.log.error('failed to sync hash. route name has not been determined');
          return;
        }
      }

      // get route
      var oRoute = this.oComponent.getRouter().getRoute(this._sRouteName);
      if (!oRoute) {
        jQuery.sap.log.error('failed to sync hash. no route with name ' + this._sRouteName);
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
    }
  });
});
