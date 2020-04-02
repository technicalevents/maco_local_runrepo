sap.ui.define(
  [
    'sap/ui/core/mvc/Controller',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/action/base/ActionExecutor',
    'com/sap/cd/maco/mmt/ui/reuse/action/base/ActionArgsInterpretation',
    'com/sap/cd/maco/mmt/ui/reuse/action/base/ActionResolution',
    'com/sap/cd/maco/mmt/ui/reuse/action/base/ActionParams',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getControllerRegistry'
  ],
  function(Controller, bundle, Assert, JSONModel, ActionExecutor, ActionArgsInterpretation, ActionResolution, ActionParams, getControllerRegistry) {
    'use strict';

    return Controller.extend('com.sap.cd.maco.mmt.ui.reuse.controller.base.BaseViewController', {
      onInit: function(oConfig) {
        this._storeConfig(oConfig);
        var oComponent = this._getComponent();
        if (oComponent) {
          this._copyReferences(oComponent);
          this._copyDeprecatedReferences(oComponent);
          this._register();
        }
      },

      _storeConfig: function(oConfig) {
        this.oConfig = oConfig ? oConfig : {};
      },

      /**
       * some strange effects with cross app nav of FLP
       * old route will be fired on the triggering app  ... but getOwnerComponent does not work anymore
       * we silently ignore this and only log a message
       */
      _getComponent: function() {
        var oComponent = this.getOwnerComponent();
        if (!oComponent) {
          jQuery.sap.log.error('BaseViewController onInit without owner component: ' + this.getMetadata().getName());
        }
        return oComponent;
      },

      _copyReferences: function(oComponent) {
        this.oComponent = oComponent;
        this.oModel = oComponent.getModel();
        this.oRouter = oComponent.getRouter();
        this.oBundle = oComponent.getModel('i18n').getResourceBundle();
        if (oComponent.mSingles) {
          this.mSingles = oComponent.mSingles;
        }
      },

      /**
       * TODO remove in next reuse lib version
       * @deprecated
       */
      _copyDeprecatedReferences: function(oComponent) {
        this.oControllerRegistry = oComponent.mSingles.controllerRegistry;
        this.oErrorManager = oComponent.mSingles.errorManager;
        this.oMessage = oComponent.mSingles.message;
        this.oMessageManager = oComponent.mSingles.messageManager;
        this.oNav = oComponent.mSingles.nav;
        this.oTransaction = oComponent.mSingles.transaction;
      },

      _register: function() {
        var oRegistry = getControllerRegistry(this, true);
        if (oRegistry) {
          oRegistry.register(this);
        }
      },

      getViewModelName: function() {
        var sDefault = 'this';
        var sName = this.oConfig.viewModelName ? this.oConfig.viewModelName : sDefault;
        return sName;
      },

      initViewModel: function() {
        var oViewModel = new JSONModel({});
        oViewModel.setDefaultBindingMode('OneWay');
        var sModelName = this.getViewModelName();
        this.getView().setModel(oViewModel, sModelName);
      },

      getViewModel: function() {
        var sName = this.getViewModelName();
        var oModel = this.getView().getModel(sName);
        if (!oModel) {
          throw new Error('no model found for ' + sName + ' on controller: ' + this);
        }
        return oModel;
      },

      onAction: function() {
        var oArgs = new ActionArgsInterpretation().getArgs(arguments);
        var oAction = new ActionResolution().getAction(this, oArgs.name);
        var oParams = new ActionParams().getParams(this, oArgs.event);
        var oExecution = {
          controller: this,
          action: oAction,
          name: oArgs.name,
          event: oArgs.event,
          params: oParams
        };
        new ActionExecutor().execute(oExecution);
      },

      getConfigControl: function(sKey, sClassName, bMandatory) {
        Assert.ok(this.oConfig.controls, 'cannot find control ' + sKey + '. controller config has no control entry.' + this);
        var sId = this.oConfig.controls[sKey];
        if (!sId && !bMandatory) {
          return null;
        }
        var oControl = this.byId(sId);
        Assert.ok(oControl, 'cannot find control ' + sKey + ' for id ' + sId);
        Assert.instance(oControl, sClassName, 'control with id ' + sId + ' must be an instance of ' + sClassName);
        return oControl;
      },

      getConfigText: function(sKey, sDefault, oObject) {
        var oI18nConfig = this.oConfig.i18n ? this.oConfig.i18n : {};
        Assert.ok(oI18nConfig, 'cannot get text. Missing configuration of i18n');
        if (!oI18nConfig || !oI18nConfig[sKey]) {
          // empty
          return bundle.getText(sDefault);
        } else if (typeof oI18nConfig[sKey] === 'string') {
          // string
          var sResult = this.oBundle.getText(oI18nConfig[sKey]);
          Assert.ok(sResult !== oI18nConfig[sKey], 'the key ' + oI18nConfig[sKey] + ' does not exist in the apps i18n file');
          return sResult;
        } else if ({}.toString.call(oI18nConfig[sKey]) === '[object Function]') {
          // function!
          if (oObject) {
            return oI18nConfig[sKey](oObject);
          } else {
            return oI18nConfig[sKey]();
          }
        } else {
          Assert.ok(false, 'cannot get text. type of ' + sKey + ' is not supported: ' + typeof oI18nConfig[sKey]);
        }
      },

      /**
       * TODO remove in next reuse version
       * @deprecated
       */
      replace: function(sString, oObject) {
        for (var sKey in oObject) {
          sString = sString.replace('{' + sKey + '}', oObject[sKey]);
        }
        return sString;
      },

      /**
       * TODO remove in next reuse version
       * @deprecated
       */
      attachParentContextChange: function(fnCallback) {
        var oView = this.getView();
        oView.attachModelContextChange(this._onModelContextChange, this);
        this._sParentPath = null;
        this._fnParentContextChange = fnCallback;
      },

      /**
       * TODO remove in next reuse version
       * @deprecated
       */
      _onModelContextChange: function(oEvent) {
        // get parent
        var oParent = this.getView().getParent();
        if (!oParent) {
          return;
        }

        // fire event only if parent path has changed
        var oContext = oParent.getBindingContext();
        var sParentPath = oContext ? oContext.getPath() : null;
        if (sParentPath && sParentPath !== this._sParentPath) {
          this._fnParentContextChange(oContext);
          this._sParentPath = sParentPath;
        }
      }
    });
  }
);
