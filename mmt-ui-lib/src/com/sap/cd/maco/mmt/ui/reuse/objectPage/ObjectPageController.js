sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/_/ActionController',
    'com/sap/cd/maco/mmt/ui/reuse/_/ODataMetaModelExt',
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/_/getConfigText',
    'com/sap/cd/maco/mmt/ui/reuse/_/getConfigControl'
  ],
  function(ActionController, ODataMetaModelExt, JSONModel, bundle, getConfigText, getConfigControl) {
    'use strict';

    return ActionController.extend('com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageController', {
      //~~~~ init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      onInit: function(config) {
        // super
        ActionController.prototype.onInit.apply(this, arguments);

        // check config
        this.oAssert.ok(config, 'cannot init ObjectPage. config missing');
        this.oAssert.ok(config.controls, 'cannot init ObjectPage. controls missing');
        this.oAssert.ok(config.routes, 'cannot init ObjectPage. routes missing');
        this.oAssert.ok(config.routes.this, 'cannot init ObjectPage. routes.this missing');
        this.oAssert.ok(config.entitySet, 'cannot init ObjectPage. entitySet missing');
        this.oConfig = config;

        //
        this._oODataMetaModelExt = new ODataMetaModelExt(this.oComponent);

        // register for routing
        var oRoute = this.oRouter.getRoute(config.routes.this);
        this.oAssert.ok(oRoute, 'ObjectPageController cannot init. the route ' + config.routes.this + ' cannot be found. check your manifest');
        oRoute.attachPatternMatched(this._onRouteMatched, this);
      },

      _getConfigText: function(sKey, sDefault, oObject) {
        return getConfigText(this, this.oConfig['i18n'], sKey, sDefault, oObject);
      },

      _getObjectPage: function() {
        return getConfigControl(this, 'objectPage', 'sap.uxap.ObjectPageLayout', true);
      },

      //~~~~ ActionController ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _getActionBusyControl: function() {
        return this.getView();
      },

      _getActionContexts: function() {
        return [this.getView().getBindingContext()];
      },

      //~~~~ private subclassers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _onBeforeBind: function() {
        throw new Error('not implemented');
      },

      _getBindingPath: function() {
        throw new Error('not implemented');
      },

      _getBindingParameters: function() {
        throw new Error('not implemented');
      },

      _getNotFoundText: function() {
        return this._getConfigText('notFoundMsg', 'objectPageNotFound', this.oRouteArgs);
      },

      //~~~~ public subclassers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      onBeforeBind: function(oRouteArgs) {},

      onAfterBind: function(oRouteArgs, oResult) {},

      getBindingSelects: function() {
        return [];
      },

      getBindingExpands: function() {
        return [];
      },

      getBindingPath: function() {
        // check that all key args are containted
        var aKeys = this._oODataMetaModelExt.getKeyArray(this.oConfig.entitySet);
        for (var i = 0; i < aKeys.length; i++) {
          var sKey = aKeys[i];
          if (!this.oRouteArgs.hasOwnProperty(sKey)) {
            this.oAssert.ok(false, 'ObjectPageController cannot bind. the route arguments do not contain the key property ' + sKey);
          }
        }

        // let model create key based on metadata
        var sPath = '/' + this.oModel.createKey(this.oConfig.entitySet, this.oRouteArgs);

        // done
        return sPath;
      },

      //~~~~ private ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _getSectionController: function() {
        var aResult = [];
        var oObjectPage = this._getObjectPage();
        var aSections = oObjectPage.getSections();
        for (var i = 0; i < aSections.length; i++) {
          var oSection = aSections[i];
          var aSubs = oSection.getSubSections();
          for (var j = 0; j < aSubs.length; j++) {
            var oSub = aSubs[j];
            var aBlocks = oSub.getBlocks();
            for (var k = 0; k < aBlocks.length; k++) {
              var oBlock = aBlocks[k];
              if (oBlock.getController) {
                var oController = oBlock.getController();
                if (oController) {
                  aResult.push(oController);
                }
              }
            }
          }
        }
        return aResult;
      },

      _onRouteMatched: function(oEvent) {
        // keep args
        this.oRouteArgs = oEvent.getParameters().arguments;

        // nofify subclassers and sub controllers
        this._onBeforeBind();
        this.onBeforeBind(this.oRouteArgs);
        var aControllers = this._getSectionController();
        aControllers.forEach(
          function(oController) {
            if (oController.onBeforeBindObjectPage) {
              oController.onBeforeBindObjectPage(this.oRouteArgs);
            }
          }.bind(this)
        );

        // bind
        var oWhenBound = this._whenBound();

        // nofify subclassers and sub controllers
        oWhenBound.then(
          function(oResult) {
            this.onAfterBind(this.oRouteArgs, oResult);
            var aControllers = this._getSectionController();
            aControllers.forEach(
              function(oController) {
                if (oController.onAfterBindObjectPage) {
                  oController.onAfterBindObjectPage(this.oRouteArgs, oResult);
                }
              }.bind(this)
            );
          }.bind(this)
        );
      },

      _whenBound: function() {
        return new Promise(
          function(resolve, reject) {
            var oMetadataLoaded = this.oModel.metadataLoaded(); // computing the binding path requires the meta data to be loaded (createKey)
            var oMetaModelLoaded = this.oModel.getMetaModel().loaded(); // computing the binding path requires the meta model to be loaded (getKeyArray)
            Promise.all([oMetadataLoaded, oMetadataLoaded]).then(
              function() {
                // get path
                var sPath = this._getBindingPath();

                // get params
                var oParams = this._getBindingParameters();

                // bind view
                this.getView().setBusy(true);
                this.getView().bindElement({
                  path: sPath,
                  parameters: oParams,
                  events: {
                    change: function() {
                      // reset busy
                      this.getView().setBusy(false);

                      // update the actions
                      this._updateActions();

                      // check 404 situation
                      var oContext = this.getView().getBindingContext();
                      if (oContext) {
                        resolve(oContext.getObject());
                      } else {
                        // show message
                        var sMsg = this._getNotFoundText();
                        this.oNav.navNotFound({
                          msg: sMsg
                        });
                        reject();
                      }
                    }.bind(this)
                  }
                });
              }.bind(this)
            );
          }.bind(this)
        );
      }
    });
  }
);
