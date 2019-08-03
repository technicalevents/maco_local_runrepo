sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/_/ActionController',
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/_/getConfigControl'
  ],
  function(ActionController, JSONModel, bundle, getConfigControl) {
    'use strict';

    return ActionController.extend('com.sap.cd.maco.mmt.ui.reuse.table.ActionSmartTableController', {
      onInit: function(oConfig) {
        // super
        ActionController.prototype.onInit.apply(this, arguments);

        // check config
        this.oAssert.ok(oConfig.controls, 'cannot init ActionSmartTableController. controls must be set');
        this.oAssert.ok(oConfig.controls.table, 'cannot init ActionSmartTableController. controls.table must be set');
        this.oAssert.ok(oConfig.entitySet, 'cannot init ActionSmartTableController. entitySet must be set');
        this.oConfig = oConfig;

        // attach table events
        var oTable = this._getSmartTable();
        oTable.attachEvent('dataReceived', this._updateActions, this); // after deleting contexts updates might be necessary
        oTable.getTable().attachEvent('selectionChange', this._updateActions, this);

        // set entitySet
        this.getThisModel().setProperty('/entitySet', oConfig.entitySet);

        // set mode initially
        this._setMode();
      },

      // inherited from ActionController
      _getActionBusyControl: function() {
        return this._getSmartTable();
      },

      // inherited from ActionController
      _getActionContexts: function() {
        return this._getSmartTable()
          .getTable()
          .getSelectedContexts();
      },

      _getSmartTable: function() {
        return getConfigControl(this, 'table', 'sap.ui.comp.smarttable.SmartTable', true);
      },

      setShowActions: function() {
        ActionController.prototype.setShowActions.apply(this, arguments);
        this._setMode();
      },

      _setMode: function() {
        var sMode = this._bShowActions ? 'MultiSelect' : 'None';
        this.getThisModel().setProperty('/tableMode', sMode);
      },

      rebindTable: function() {
        this._getSmartTable().rebindTable();
      }
    });
  }
);
