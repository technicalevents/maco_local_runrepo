sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/component/BaseComponent',
    'jquery.sap.global',
    'sap/ui/model/json/JSONModel',
    'sap/ui/model/resource/ResourceModel',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataRequestTracer'
  ],
  function(BaseComponent, jQuery, JSONModel, ResourceModel, Assert, ODataRequestTracer) {
    'use strict';

    return BaseComponent.extend('com.sap.cd.maco.mmt.ui.reuse.component.ReuseComponent', {
      init: function() {
        BaseComponent.prototype.init.apply(this, arguments);
        this.checkManifest();
        this.initCss();
        this.initI18nModel();
        this.initAppModel();
        this.initDevMode();
        this.initRequestTracer();
      },

      checkManifest: function() {
        Assert.ok(this.getManifestEntry('sap.app'), "cannot init base component. your manifest looks faulty. no node 'sap.app'");
        Assert.ok(this.getManifestEntry('sap.ui'), "cannot init base component. your manifest looks faulty. no node 'sap.ui'");
        Assert.ok(this.getManifestEntry('sap.ui5'), "cannot init base component. your manifest looks faulty. no node 'sap.ui5'");
      },

      initCss: function() {
        var sPath = jQuery.sap.getModulePath('com.sap.cd.maco.mmt.ui.reuse.control.', '/style.css');
        jQuery.sap.includeStyleSheet(sPath);
      },

      initI18nModel: function() {
        var i18nModel = new ResourceModel({
          bundleName: 'com.sap.cd.maco.mmt.ui.reuse.messagebundle'
        });
        this.setModel(i18nModel, 'i18n-reuse');
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
      },

      initRequestTracer: function() {
        if (this.bDevMode) {
          // using single infrastructure to have the tracer being destroyed
          // yet there is no getRequestTracer access function
          this.mSingles.requestTracer = new ODataRequestTracer(this.getModel());
        }
      }
    });
  }
);
