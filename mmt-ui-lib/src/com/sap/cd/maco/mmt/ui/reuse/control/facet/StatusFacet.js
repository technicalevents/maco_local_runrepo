sap.ui.define(['sap/ui/core/Control', 'sap/ui/layout/VerticalLayout', 'sap/m/Label', 'sap/m/ObjectStatus'], function(
  Control,
  VerticalLayout,
  Label,
  ObjectStatus
) {
  'use strict';

  return Control.extend('com.sap.cd.maco.mmt.ui.reuse.control.facet.StatusFacet', {
    metadata: {
      properties: {
        label: { type: 'string', defaultValue: '' },
        text: { type: 'string', defaultValue: '' },
        icon: { type: 'string', defaultValue: '' },
        state: { type: 'string', defaultValue: 'None' }
      },
      aggregations: {
        _layout: {
          type: 'sap.ui.layout.VerticalLayout',
          multiple: false,
          visibility: 'hidden'
        }
      },
      events: {}
    },

    init: function() {
      var oAttribute = new Label({});
      var oStatus = new ObjectStatus({ state: 'None', icon: '' });
      var oLayout = new VerticalLayout({
        content: [oAttribute, oStatus]
      });
      oLayout.addStyleClass('comSapCdMacoMmtUiReuseStatusFacet');
      this.setAggregation('_layout', oLayout);
    },

    _getLabel: function() {
      var oLayout = this.getAggregation('_layout');
      return oLayout.getContent()[0];
    },

    _getStatus: function() {
      var oLayout = this.getAggregation('_layout');
      return oLayout.getContent()[1];
    },

    setLabel: function(sValue) {
      this._getLabel().setText(sValue);
    },

    setText: function(sValue) {
      this._getStatus().setText(sValue);
    },

    setIcon: function(sValue) {
      this._getStatus().setIcon(sValue);
    },

    setState: function(sValue) {
      this._getStatus().setState(sValue);
    },

    getLabel: function() {
      return this._getLabel().getText();
    },

    getText: function() {
      return this._getStatus().getText();
    },

    getIcon: function() {
      return this._getStatus().getIcon();
    },

    getState: function() {
      return this._getStatus().getState();
    },

    renderer: function(oRM, oControl) {
      // i just found no easier or more public way to pass the style classes
      // (i overwrote addStyleClass but it was called only once for the template of an aggregation)
      var oLayout = oControl.getAggregation('_layout');
      if (oControl.aCustomStyleClasses) {
        oControl.aCustomStyleClasses.forEach(function(sClass) {
          oLayout.addStyleClass(sClass);
        });
      }
      // render
      oRM.renderControl(oLayout);
    }
  });
});
