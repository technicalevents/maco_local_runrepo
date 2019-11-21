/* eslint-disable sap-no-absolute-component-path */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object', 'sap/ui/core/routing/HashChanger', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'], function(
  jQuery,
  UI5Object,
  HashChanger,
  Assert
) {
  'use strict';

  return UI5Object.extend('com.sap.cd.maco.mmt.ui.reuse.objects.nav.HashSync', {
    constructor: function(params) {
      // check params
      Assert.ok(params.component, 'Cannot init HashSync. component not set');
      Assert.ok(params.routeName || params.getRouteName, 'Cannot init HashSync. routeName or getRouteName must be set');
      Assert.ok(!(params.routeName && params.getRouteName), 'Cannot init HashSync. you cannot use both routeName and getRouteName');
      // store params
      this._oComponent = params.component;
      this._sRouteName = params.routeName;
      this._fnGetRouteName = params.getRouteName;
    },

    synch: function() {
      // abort if the hash is already set
      // (this is considered stronger than startup parameter)
      var oHashChanger = HashChanger.getInstance();
      var sCurrentHash = oHashChanger.getHash();
      if (sCurrentHash) {
        jQuery.sap.log.info('HashSync aborted. hash wins over startupParameters');
        return;
      }

      // get component data
      var oComponentData = this._oComponent.getComponentData();
      if (!oComponentData) {
        return;
      }
      var startupParams = oComponentData.startupParameters;
      if (!startupParams || Object.keys(startupParams).length === 0) {
        jQuery.sap.log.info('HashSync aborted. no startupParameters');
        return;
      }

      // get route name
      if (!this._sRouteName) {
        try {
          this._sRouteName = this._fnGetRouteName(startupParams);
        } catch (e) {}
        if (!this._sRouteName) {
          Assert.ok(false, 'Cannot sync hash. getRouteName returned no value');
        }
      }

      // get route
      var oRoute = this._oComponent.getRouter().getRoute(this._sRouteName);
      Assert.ok(oRoute, 'Cannot sync hash. found no route with name ' + this._sRouteName);

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
        jQuery.sap.log.info('HashSync aborted. Not all route params have been replaced by startup params: ' + sPattern);
        return;
      }

      // finally replace hash
      oHashChanger.replaceHash(sPattern);
    }
  });
});
