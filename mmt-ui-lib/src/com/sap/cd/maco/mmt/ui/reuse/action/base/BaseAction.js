/*global location*/
sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert', 'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle'], function(
  Object,
  Assert,
  bundle
) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.action.base.BaseAction', {
    constructor: function(oComponent, oConfig, sCardinality) {
      this.oConfig = oConfig ? oConfig : {};
      Assert.ok(oComponent, 'cannot init action. no component');
      this._copyReferences(oComponent);
      this._copyDeprecatedReferences(oComponent);
      if (sCardinality) {
        this._setCardinality(sCardinality);
      } else {
        this._setMinMaxContexts();
      }
    },

    _setMinMaxContexts: function() {
      if (!this.oConfig.hasOwnProperty('minContexts')) {
        this.oConfig.minContexts = -1;
      }
      if (!this.oConfig.hasOwnProperty('maxContexts')) {
        this.oConfig.maxContexts = -1;
      }
      Assert.int(this.oConfig.minContexts, 'cannot instantiate base action. minContexts is not an integer');
      Assert.int(this.oConfig.maxContexts, 'cannot instantiate base action. maxContexts is not an integer');
    },

    /**
     * cardinality is deprecated, TODO delete
     */
    _setCardinality: function(sCardinality) {
      Assert.ok(
        sCardinality === '0' || sCardinality === '1' || sCardinality === '1..N' || sCardinality === '2..N',
        'cannot instantiate base action. cardinality must be 0, 1, 1..N or 2..N'
      );
      if (!sCardinality) {
        return;
      }
      this._sCardinality = sCardinality;
      if (sCardinality === '0') {
        this.oConfig.minContexts = -1;
        this.oConfig.maxContexts = -1;
      } else if (sCardinality === '1') {
        this.oConfig.minContexts = 1;
        this.oConfig.maxContexts = 1;
      } else if (sCardinality === '1..N') {
        this.oConfig.minContexts = 1;
        this.oConfig.maxContexts = -1;
      } else if (sCardinality === '2..N') {
        this.oConfig.minContexts = 2;
        this.oConfig.maxContexts = -1;
      } else {
        throw new Error('unhandled cardinality: ' + sCardinality);
      }
    },

    _copyReferences: function(oComponent) {
      this.oComponent = oComponent;
      this.oModel = oComponent.getModel();
      this.oRouter = oComponent.getRouter();
      this.oBundle = oComponent.getModel('i18n').getResourceBundle();
      this.mSingles = oComponent.mSingles;
    },

    /**
     * TODO remove in next reuse version
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

    cardinality: function() {
      return this._sCardinality;
    },

    execute: function(params) {
      Assert.ok(false, 'cannot execute. subclasser of BaseAction has not overriden execute');
    },

    getConfigText: function(sKey, sDefault, oObject) {
      if (!this.oConfig || !this.oConfig[sKey]) {
        // empty
        return bundle.getText(sDefault);
      } else if (typeof this.oConfig[sKey] === 'string') {
        // string
        var sResult = this.oBundle.getText(this.oConfig[sKey]);
        Assert.ok(sResult !== this.oConfig[sKey], 'the key ' + this.oConfig[sKey] + ' does not exist in the apps i18n file');
        return sResult;
      } else if ({}.toString.call(this.oConfig[sKey]) === '[object Function]') {
        // function!
        if (oObject) {
          return this.oConfig[sKey](oObject);
        } else {
          return this.oConfig[sKey]();
        }
      } else {
        Assert.ok(false, 'cannot get text. type of ' + sKey + ' is not supported: ' + typeof this.oConfig[sKey]);
      }
    },

    assertContextParam: function(oParams) {
      Assert.ok(oParams, 'invalid action. no oParams');
      Assert.ok(oParams.contexts, 'invalid action. no contexts');
      Assert.array(oParams.contexts, 'invalid action. contexts is no array');
      Assert.ok(oParams.contexts.length > 0, 'invalid action. contexts is empty');
      Assert.ok(oParams.contexts[0], 'invalid action. contexts contains an empty context');
    }
  });
});
