/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/UI5Metadata',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataMetaModelExt',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseAction, bundle, UI5Metadata, ODataMetaModelExt, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.nodraft.CreateAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig);
        this._oODataMetaModelExt = new ODataMetaModelExt(oComponent);
      },

      /**
       * @deprecated
       */
      enabled: function(aContexts) {
        return true;
      },

      execute: function(oParams) {
        if (!oParams.properties) {
          oParams.properties = {};
        }

        return new Promise(
          function(resolve, reject) {
            try {
              // get entity set
              var oConConfig = oParams.controller.oConfig;
              var sEntitySet = this.oConfig.entitySet ? this.oConfig.entitySet : oConConfig.entitySet;
              Assert.ok(
                sEntitySet,
                'cannot execute create action. no entitySet. configure the entitySet on the action or on the executing controller'
              );

              // create a entry
              var sPath = '/' + sEntitySet;
              var oContext = this.oModel.createEntry(sPath, {
                properties: oParams.properties,
                success: function() {}.bind(this)
              });

              // get properties from meta model
              var aProperties = this._oODataMetaModelExt.getProperties(sEntitySet);

              // compute route
              var sRoute = oConConfig.routes && oConConfig.routes.child ? oConConfig.routes.child : this.oConfig.route;
              Assert.ok(
                sRoute,
                'cannot execute create action. no route. configure the childRoute on the executing controller or the route on this action'
              );

              // get route
              var oRoute = this.oRouter.getRoute(sRoute);
              Assert.ok(oRoute, 'cannot execute create action. route ' + sRoute + ' cannot be found. check your manifest');

              // get value
              var sFakePath = oContext.getPath();
              var sValue = '~~~' + sFakePath.substring(sFakePath.indexOf("('") + 2, sFakePath.lastIndexOf("')"));

              // iterate object properties and find route args
              var oArgs = {};
              var sPattern = oRoute.getPattern();
              for (var i = 0; i < aProperties.length; i++) {
                var sProperty = aProperties[i].name;
                var sRouteParam = '{' + sProperty + '}';
                if (sPattern.indexOf(sRouteParam) !== -1) {
                  oArgs[sProperty] = sValue;
                  sPattern = sPattern.replace(sRouteParam, sValue);
                }
              }

              // all replaced?
              Assert.ok(
                sPattern.indexOf('{') === -1,
                'cannot execute CreateAction. not all params have been replaced by object properties: ' + sPattern
              );

              // reset message handling is done in object page because this would be the wrong controller to call it

              // navigate
              this.oRouter.navTo(sRoute, oArgs);

              // done
              resolve({
                params: oParams
              });
            } catch (e) {
              jQuery.sap.log.error(e);
              reject();
            }
          }.bind(this)
        );
      }
    });
  }
);
