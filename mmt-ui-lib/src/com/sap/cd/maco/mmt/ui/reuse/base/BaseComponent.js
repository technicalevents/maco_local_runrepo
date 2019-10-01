sap.ui.define(
  [
    'sap/ui/core/UIComponent',
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/resource/ResourceModel',
    'com/sap/cd/maco/mmt/ui/reuse/base/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/message/Message',
    'com/sap/cd/maco/mmt/ui/reuse/message/MessageManager',
    'com/sap/cd/maco/mmt/ui/reuse/odata/ODataRequestTracer',
    'com/sap/cd/maco/mmt/ui/reuse/nav/Navigation',
    'com/sap/cd/maco/mmt/ui/reuse/base/ControllerRegistry'
  ],
  function(UIComponent, jQuery, JSONModel, ResourceModel, Assert, Message, MessageManager, ODataRequestTracer, Navigation, ControllerRegistry) {
    'use strict';

    return UIComponent.extend('com.sap.cd.maco.mmt.ui.reuse.base.BaseComponent', {
      init: function() {
        // Call super
        UIComponent.prototype.init.apply(this, arguments);

        // our stuff
        this.baseProperties = [];
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
        this.initControllerRegistry();
      },

      exit: function() {
        this.destroyMessage();
        this.destroyMessageManager();
        this.destroyRequestTracer();
      },

      initAssert: function() {
        this.oAssert = new Assert();
        this.baseProperties.push('oAssert');
      },

      initCss: function() {
        var sPath = jQuery.sap.getModulePath('com.sap.cd.maco.mmt.ui.reuse.css.', '/style.css');
        jQuery.sap.includeStyleSheet(sPath);
      },

      initI18nModel: function() {
        var i18nModel = new ResourceModel({
          bundleName: 'com.sap.cd.maco.mmt.ui.reuse.messagebundle'
        });
        this.setModel(i18nModel, 'i18n-reuse');
      },

      initBundle: function() {
        this.oBundle = this.getModel('i18n').getResourceBundle();
        this.baseProperties.push('oBundle');
      },

      initAppModel: function() {
        // add startup parameters
        var oData = {};
        var oComponentData = this.getComponentData();
        if (oComponentData && oComponentData.startupParameters) {
          oData.startupParams = oComponentData.startupParams;
        }
        // create model
        var oAppModel = new JSONModel(oData);
        oAppModel.setDefaultBindingMode('OneWay');
        this.setModel(oAppModel, 'app');
      },

      initMessage: function() {
        this.oMessage = new Message(this);
        this.baseProperties.push('oMessage');
      },

      initMessageManager: function() {
        this.oMessageManager = new MessageManager({
          component: this,
          message: this.oMessage
        });
        this.baseProperties.push('oMessageManager');
      },

      initDevMode: function() {
        this.bDevMode = document.location.search.indexOf('sap-dev') !== -1;
        var oAppModel = this.getModel('app');
        oAppModel.setData(
          {
            devMode: {
              enabled: this.bDevMode,
              disabled: !this.bDevMode
            }
          },
          true
        );
        this.baseProperties.push('bDevMode');
      },

      initRequestTracer: function() {
        if (this.bDevMode) {
          this._oRequestTracer = new ODataRequestTracer(this.getModel());
        }
      },

      initNav: function() {
        this.oNav = new Navigation(this);
        this.baseProperties.push('oNav');
      },

      initControllerRegistry: function() {
        this.oControllerRegistry = new ControllerRegistry(this.oAssert);
        this.baseProperties.push('oControllerRegistry');
      },

      destroyMessage: function() {
        this.oMessage.destroy();
      },

      destroyMessageManager: function() {
        this.oMessageManager.destroy();
      },

      destroyRequestTracer: function() {
        if (this._oRequestTracer) {
          this._oRequestTracer.destroy();
        }
      }
    });
  }
);
