/*global location*/
sap.ui.define(
  [
    'sap/ui/base/Object',
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/resource/ResourceModel',
    'com/sap/cd/maco/mmt/ui/reuse/base/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/message/Message',
    'com/sap/cd/maco/mmt/ui/reuse/message/MessageManager',
    'com/sap/cd/maco/mmt/ui/reuse/odata/ODataRequestTracer',
    'com/sap/cd/maco/mmt/ui/reuse/nav/Navigation'
  ],
  function(Object, jQuery, JSONModel, ResourceModel, Assert, Message, MessageManager, ODataRequestTracer, Navigation) {
    'use strict';

    return Object.extend('com.sap.cd.maco.mmt.ui.reuse.bootstrap.BootstrapDraft', {
      constructor: function(oComponent) {
        this._oComponent = oComponent;
        this._oComponent.baseProperties = []; // base properties are copied to base controllers and actions
      },

      initComponent: function() {
        this.initAssert();
        this.initCss();
        this.initI18nModel();
        this.initBundle();
        this.initAppModel();
        this.initMessage();
        this.initMessageManager();
        this.initDevMode();
        this.initRequestTracer();
        this.initNav();
      },

      destroyComponent: function() {
        this.destroyMessage();
        this.destroyMessageManager();
        this.destroyRequestTracer();
      },

      initAssert: function() {
        this._oComponent.oAssert = new Assert();
        this._oComponent.baseProperties.push('oAssert');
      },

      initCss: function() {
        var sPath = jQuery.sap.getModulePath('com.sap.cd.maco.mmt.ui.reuse.css.', '/style.css');
        jQuery.sap.includeStyleSheet(sPath);
      },

      initI18nModel: function() {
        var i18nModel = new ResourceModel({
          bundleName: 'com.sap.cd.maco.mmt.ui.reuse.messagebundle'
        });
        this._oComponent.setModel(i18nModel, 'i18n-reuse');
      },

      initBundle: function() {
        this._oComponent.oBundle = this._oComponent.getModel('i18n').getResourceBundle();
        this._oComponent.baseProperties.push('oBundle');
      },

      initAppModel: function() {
        // add startup parameters
        var oData = {};
        var oComponentData = this._oComponent.getComponentData();
        if (oComponentData && oComponentData.startupParameters) {
          oData.startupParams = oComponentData.startupParams;
        }
        // create model
        var oAppModel = new JSONModel(oData);
        oAppModel.setDefaultBindingMode('OneWay');
        this._oComponent.setModel(oAppModel, 'app');
      },

      initMessage: function() {
        this._oComponent.oMessage = new Message(this._oComponent);
        this._oComponent.baseProperties.push('oMessage');
      },

      initMessageManager: function() {
        this._oComponent.oMessageManager = new MessageManager({
          component: this._oComponent,
          message: this._oComponent.oMessage
        });
        this._oComponent.baseProperties.push('oMessageManager');
      },

      initDevMode: function() {
        this._oComponent.bDevMode = document.location.search.indexOf('sap-dev') !== -1;
        var oAppModel = this._oComponent.getModel('app');
        oAppModel.setData(
          {
            devMode: {
              enabled: this._oComponent.bDevMode,
              disabled: !this._oComponent.bDevMode
            }
          },
          true
        );
        this._oComponent.baseProperties.push('bDevMode');
      },

      initRequestTracer: function() {
        if (this._oComponent.bDevMode) {
          this._oComponent._oRequestTracer = new ODataRequestTracer(this._oComponent.getModel());
        }
      },

      initNav: function() {
        this._oComponent.oNav = new Navigation(this._oComponent);
        this._oComponent.baseProperties.push('oNav');
      },

      destroyMessage: function() {
        this._oComponent.oMessage.destroy();
      },

      destroyMessageManager: function() {
        this._oComponent.oMessageManager.destroy();
      },

      destroyRequestTracer: function() {
        if (this._oComponent._oRequestTracer) {
          this._oComponent._oRequestTracer.destroy();
        }
      }
    });
  }
);
