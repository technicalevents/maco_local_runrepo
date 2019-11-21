sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseViewController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataMetaModelExt',
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/getConfigText',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/getConfigControl',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseViewController, ODataMetaModelExt, JSONModel, bundle, getConfigText, getConfigControl, Assert) {
    'use strict';

    return BaseViewController.extend('com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageController', {
      //~~~~ init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      onInit: function(config) {
        // super
        BaseViewController.prototype.onInit.apply(this, arguments);

        // check config
        Assert.ok(config, 'cannot init ObjectPage. config missing');
        Assert.ok(config.controls, 'cannot init ObjectPage. controls missing');
        Assert.ok(config.routes, 'cannot init ObjectPage. routes missing');
        Assert.ok(config.routes.this, 'cannot init ObjectPage. routes.this missing');
        Assert.ok(config.entitySet, 'cannot init ObjectPage. entitySet missing');

        //
        this._oODataMetaModelExt = new ODataMetaModelExt(this.oComponent);

        // set this model
        var oThisModel = new JSONModel({});
        oThisModel.setDefaultBindingMode('OneWay');
        this.getView().setModel(oThisModel, 'this');

        // register for routing
        var oRoute = this.oRouter.getRoute(config.routes.this);
        Assert.ok(oRoute, 'ObjectPageController cannot init. the route ' + config.routes.this + ' cannot be found. check your manifest');
        oRoute.attachPatternMatched(this._onRouteMatched, this);
      },

      _getConfigText: function(sKey, sDefault, oObject) {
        return getConfigText(this, this.oConfig['i18n'], sKey, sDefault, oObject);
      },

      _getObjectPage: function() {
        return getConfigControl(this, 'objectPage', 'sap.uxap.ObjectPageLayout', true);
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
            Assert.ok(false, 'ObjectPageController cannot bind. the route arguments do not contain the key property ' + sKey);
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
        // bind
        this._fireOnBeforeBind();
        this._bind();
      },

      refreshBinding: function() {
        this.getView().setBusy(true);
        var oViewBinding = this.getView().getElementBinding();
        this._fireOnBeforeBind();
        oViewBinding.refresh(true);
      },

      _fireOnBeforeBind: function() {
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
      },

      _bind: function() {
        var oMetadataLoaded = this.oModel.metadataLoaded(); // computing the binding path requires the meta data to be loaded (createKey)
        var oMetaModelLoaded = this.oModel.getMetaModel().loaded(); // computing the binding path requires the meta model to be loaded (getKeyArray)
        Promise.all([oMetadataLoaded, oMetaModelLoaded]).then(
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
                change: this._bindingChange.bind(this)
              }
            });
          }.bind(this)
        );
      },

      /**
       * This function is called as well from '_bind' as from 'rebind'.
       * The first is easy to spot the second a matter of UI5 behaviour.
       */
      _bindingChange: function() {
        // reset busy
        this.getView().setBusy(false);

        // check 404 situation
        var oContext = this.getView().getBindingContext();
        if (oContext) {
          // nofify subclassers and sub controllers
          var oResult = oContext.getObject();
          this.onAfterBind(this.oRouteArgs, oResult);
          var aControllers = this._getSectionController();
          aControllers.forEach(
            function(oController) {
              if (oController.onAfterBindObjectPage) {
                oController.onAfterBindObjectPage(this.oRouteArgs, oResult);
              }
            }.bind(this)
          );
        } else {
          // show message
          var sMsg = this._getNotFoundText();
          this.oNav.navNotFound({
            msg: sMsg
          });
        }
      }
    });
  }
);
