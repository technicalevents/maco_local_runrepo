sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/base/BaseViewController',
    'com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate',
    'com/sap/cd/maco/mmt/ui/reuse/_/getConfigControl',
    'sap/ui/model/json/JSONModel'
  ],
  function(bundle, BaseViewController, SmartTableBindingUpdate, getConfigControl, JSONModel) {
    'use strict';

    return BaseViewController.extend('com.sap.cd.maco.mmt.ui.reuse.table.SmartTableController', {
      onInit: function(oConfig) {
        BaseViewController.prototype.onInit.apply(this, arguments);

        // attach table events
        var oTable = this._getSmartTable();
        oTable.attachEvent('dataReceived', this._enableActions, this); // after deleting contexts updates might be necessary
        oTable.getTable().attachEvent('selectionChange', this._enableActions, this);

        // init this model
        this.getView().setModel(new JSONModel({}), 'this');
        
        // set entitySet
        this.getThisModel().setProperty('/entitySet', oConfig.entitySet);
      },

      _getSmartTable: function() {
        return getConfigControl(this, 'table', 'sap.ui.comp.smarttable.SmartTable', true);
      },

      _enableActions: function() {
        if (!this.oConfig.tableAccessControl) {
          return;
        }

        // reset
        this.getThisModel().setProperty('/tableActionEnabled', {});

        // iterate actions
        for (var sAction in this.oConfig.tableAccessControl) {
          // get AC property
          var oAccessControl = this.oConfig.tableAccessControl[sAction];
          this.oAssert.ok(oAccessControl, 'ActionController failed to enable actions. no AC property for ' + sAction);

          // get cardinality
          var oAction = this.oConfig.actions[sAction];
          this.oAssert.ok(oAction, 'ActionController failed to enable actions. no action for ' + sAction);
          var sCardinality = oAction.cardinality();

          // determine enabled
          var bEnabled;
          var oTable = this._getSmartTable().getTable();
          var aContexts = oTable.getSelectedContexts();
          if (sCardinality === '0') {
            bEnabled = true;
          } else if (sCardinality === '1') {
            var bAccessControl = this._evaluateAccessControls(oAccessControl, aContexts);
            bEnabled = aContexts.length === 1 && bAccessControl;
          } else if (sCardinality === '1..N') {
            var bAccessControl = this._evaluateAccessControls(oAccessControl, aContexts);
            bEnabled = aContexts.length >= 1 && bAccessControl;
          } else if (sCardinality === '2..N') {
            var bAccessControl = this._evaluateAccessControls(oAccessControl, aContexts);
            bEnabled = aContexts.length >= 2 && bAccessControl;
          } else {
            throw new Error('unhandled cardinality: ' + sCardinality);
          }

          this.getThisModel().setProperty('/tableActionEnabled/' + sAction, bEnabled);
        }
      },

      _evaluateAccessControls: function(oAccessControl, aContexts) {
        for (var i = 0; i < aContexts.length; i++) {
          if (!this._evaluateAccessControl(oAccessControl, aContexts[i])) {
            return false;
          }
        }
        return true;
      },

      _evaluateAccessControl: function(oAccessControl, oContext) {
        if (typeof oAccessControl === 'string') {
          var oObject = oContext.getObject();
          this.oAssert.ok(oObject.hasOwnProperty(oAccessControl), 'cannot check access control. object does not have property: ' + oAccessControl);
          return oObject[oAccessControl];
        } else if (typeof oAccessControl === 'boolean') {
          return oAccessControl;
        } else if (typeof oAccessControl === 'function') {
          return !!oAccessControl(oContext);
        } else {
          this.oAssert.ok(false, 'cannot check access control. unhandled type of access control ' + oAccessControl);
        }
      },

      onBeforeRebindTable: function(oEvent) {
        var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));
        oUpdate.addExpands(this.getBindingExpands());
        oUpdate.addSelects(this.getBindingSelects());
        oUpdate.addSorters(this.getBindingSorters());
        oUpdate.addCustomParameters(this.getCustomParameters());
      },

      getBindingFiltersAnd: function() {
        return [];
      },

      getBindingFiltersOr: function() {
        return [];
      },

      getBindingExpands: function() {
        return [];
      },

      getBindingSelects: function() {
        return [];
      },

      getBindingSorters: function() {
        return [];
      },

      getCustomParameters: function() {
        return [];
      }
    });
  }
);
