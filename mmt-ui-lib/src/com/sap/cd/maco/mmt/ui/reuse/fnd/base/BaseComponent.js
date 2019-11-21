sap.ui.define(
  [
    'sap/ui/core/UIComponent',
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/resource/ResourceModel',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Message',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/message/ErrorManager',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataRequestTracer',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/nav/Navigation',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/ControllerRegistry'
  ],
  function(UIComponent, jQuery, JSONModel, ResourceModel, Assert, Message, ErrorManager, ODataRequestTracer, Navigation, ControllerRegistry) {
    'use strict';

    return UIComponent.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.base.BaseComponent', {
      init: function() {
        // Call super
        UIComponent.prototype.init.apply(this, arguments);

        // our stuff
        this.baseProperties = [];
        this.initCss();
        this.initI18nModel();
        this.initBundle();
        this.initAppModel();
        this.initMessage();
        this.initErrorManager();
        this.initDevMode();
        this.initRequestTracer();
        this.initNav();
        this.initControllerRegistry();
        this.initMessageManager();
      },

      exit: function() {
        this.destroyMessage();
        this.destroyErrorManager();
        this.destroyRequestTracer();
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
        var oI18nModel = this.getModel('i18n');
        Assert.ok(oI18nModel, 'cannot init component. no i18n model.');
        this.oBundle = oI18nModel.getResourceBundle();
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

      initErrorManager: function() {
        this.oErrorManager = new ErrorManager({
          component: this,
          message: this.oMessage
        });
        this.baseProperties.push('oErrorManager');
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
        this.oControllerRegistry = new ControllerRegistry();
        this.baseProperties.push('oControllerRegistry');
      },

      initMessageManager: function() {
        this.oMessageManager = sap.ui.getCore().getMessageManager();
        this.baseProperties.push('oMessageManager');
      },

      destroyMessage: function() {
        this.oMessage.destroy();
      },

      destroyErrorManager: function() {
        this.oErrorManager.destroy();
      },

      destroyRequestTracer: function() {
        if (this._oRequestTracer) {
          this._oRequestTracer.destroy();
        }
      }
    });
  }
);
