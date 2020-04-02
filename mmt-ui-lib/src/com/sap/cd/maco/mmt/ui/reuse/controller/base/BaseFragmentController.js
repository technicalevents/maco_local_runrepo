sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/controller/base/FragmentController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/action/base/ActionExecutor',
    'com/sap/cd/maco/mmt/ui/reuse/action/base/ActionArgsInterpretation',
    'com/sap/cd/maco/mmt/ui/reuse/action/base/ActionResolution',
    'com/sap/cd/maco/mmt/ui/reuse/action/base/ActionParams',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getControllerRegistry'
  ],
  function(FragmentController, Assert, JSONModel, ActionExecutor, ActionArgsInterpretation, ActionResolution, ActionParams, getControllerRegistry) {
    'use strict';

    return FragmentController.extend('com.sap.cd.maco.mmt.ui.reuse.controller.base.BaseFragmentController', {
      constructor: function(params) {
        FragmentController.call(this, params);
      },

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
          jQuery.sap.log.error('BaseFragmentController onInit without owner component: ' + this.getMetadata().getName());
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

      getFragmentModelName: function() {
        var sDefault = 'this';
        var sName = this.oConfig.fragmentModelName ? this.oConfig.fragmentModelName : sDefault;
        return sName;
      },

      initFragmentModel: function() {
        var oFragmentModel = new JSONModel({});
        oFragmentModel.setDefaultBindingMode('OneWay');
        var sModelName = this.getFragmentModelName();
        this.getFragment().setModel(oFragmentModel, sModelName);
      },

      getFragmentModel: function() {
        var sName = this.getFragmentModelName();
        var oModel = this.getFragment().getModel(sName);
        if (!oModel) {
          throw new Error('no model found for ' + sName + ' on controller: ' + this);
        }
        return oModel;
      },

      onAction: function() {
        var oArgs = new ActionArgsInterpretation().getArgs(arguments);
        var oAction = new ActionResolution().getAction(this, oArgs.name);
        var oParams = new ActionParams().getParams(this, oArgs.event);
        if (!this._oActionExecutor) {
          this._oActionExecutor = new ActionExecutor();
        }
        this._oActionExecutor.execute({
          controller: this,
          action: oAction,
          name: oArgs.name,
          event: oArgs.event,
          params: oParams
        });
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
      }
    });
  }
);
