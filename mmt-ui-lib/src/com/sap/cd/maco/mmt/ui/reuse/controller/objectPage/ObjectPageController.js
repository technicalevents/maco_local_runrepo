sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/controller/base/BaseViewController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataMetaModelExt',
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getNav'
  ],
  function(BaseViewController, ODataMetaModelExt, JSONModel, bundle, Assert, getNav) {
    'use strict';

    return BaseViewController.extend('com.sap.cd.maco.mmt.ui.reuse.controller.objectPage.ObjectPageController', {
      //~~~~ init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      onInit: function(config) {
        BaseViewController.prototype.onInit.apply(this, arguments);
        this._checkConfig();
        this._oODataMetaModelExt = new ODataMetaModelExt(this.oComponent);
        this.initViewModel();
        this._registerRoutes();
      },

      _checkConfig: function() {
        Assert.ok(this.oConfig, 'cannot init ObjectPage. config missing');
        Assert.ok(this.oConfig.controls, 'cannot init ObjectPage. controls missing');
        Assert.ok(this.oConfig.routes, 'cannot init ObjectPage. routes missing');
        Assert.ok(this.oConfig.routes.this, 'cannot init ObjectPage. routes.this missing');
        Assert.ok(this.oConfig.entitySet, 'cannot init ObjectPage. entitySet missing');
        if (this.oConfig.flpNavMenu) {
          Assert.ok(this.oConfig.flpNavMenu.title, 'cannot init ObjectPage. missing config: flpNavMenu.title');
          Assert.ok(this.oConfig.flpNavMenu.parentTitle, 'cannot init ObjectPage. missing config: flpNavMenu.parentTitle');
          Assert.ok(this.oConfig.flpNavMenu.parentIntent, 'cannot init ObjectPage. missing config: flpNavMenu.parentIntent');
          var oEntry = this.oComponent.getManifestEntry('sap.ui5');
          Assert.ok(
            !oEntry ||
              !oEntry.services ||
              !oEntry.services.ShellUIService ||
              !oEntry.services.ShellUIService.settings ||
              (oEntry.services.ShellUIService.settings.setHierarchy !== 'auto' && oEntry.services.ShellUIService.settings.setTitle !== 'auto'),
            'cannot init ObjectPage. flpNavMenu conflicts with the ShellUIService which is set to auto in manifest. Change this to manual'
          );
        }
      },

      _registerRoutes: function() {
        var oRoute = this.oRouter.getRoute(this.oConfig.routes.this);
        Assert.ok(oRoute, 'ObjectPageController cannot init. the route ' + this.oConfig.routes.this + ' cannot be found. check your manifest');
        oRoute.attachPatternMatched(this._onRouteMatched, this);
      },

      _getObjectPage: function() {
        return this.getConfigControl('objectPage', 'sap.uxap.ObjectPageLayout', false);
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
        return this.getConfigText('notFoundMsg', 'objectPageNotFound', this.oRouteArgs);
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
        if (!oObjectPage) {
          return aResult;
        }
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
        this.oRouteArgs = oEvent.getParameters().arguments;
        this._fireOnBeforeBind();
        this._setFlpNavMenu();
        this._bind();
      },

      refreshBinding: function() {
        this.getView().setBusy(true);
        var oViewBinding = this.getView().getElementBinding();
        this._fireOnBeforeBind();
        oViewBinding.refresh(true);
      },

      _setFlpNavMenu: function() {
        if (!this.oConfig.flpNavMenu) {
          return;
        }
        this.oComponent.getService('ShellUIService').then(
          function(oService) {
            var sTitle = this.oBundle.getText(this.oConfig.flpNavMenu.title);
            var sParentTitle = this.oBundle.getText(this.oConfig.flpNavMenu.parentTitle);
            var sParentIntent = this.oConfig.flpNavMenu.parentIntent;
            oService.setTitle(sTitle);
            oService.setHierarchy([
              {
                title: sParentTitle,
                intent: sParentIntent
              }
            ]);
          }.bind(this),
          function(oError) {
            Assert.ok(false, 'Cannot set FLP nav menu. Cannot get ShellUIService.');
          }
        );
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
          getNav(this).navNotFound({
            msg: sMsg
          });
        }
      }
    });
  }
);
