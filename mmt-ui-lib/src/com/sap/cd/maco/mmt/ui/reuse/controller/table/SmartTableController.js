sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/base/BaseViewController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(bundle, BaseViewController, SmartTableBindingUpdate, Assert) {
    'use strict';

    return BaseViewController.extend('com.sap.cd.maco.mmt.ui.reuse.controller.table.SmartTableController', {
      onInit: function(oConfig) {
        BaseViewController.prototype.onInit.apply(this, arguments);

        // attach table events
        var oTable = this.getSmartTable();
        oTable.attachEvent('dataReceived', this._enableActions, this); // after deleting contexts updates might be necessary
        oTable.getTable().attachEvent('selectionChange', this._enableActions, this);

        // set this model
        this.initViewModel();

        // set entitySet
        if (oConfig.entitySet) {
          this.getViewModel().setProperty('/entitySet', oConfig.entitySet);
        }

        // initialize enablement
        this._enableActions();
      },

      getSmartTable: function() {
        return this.getConfigControl('table', 'sap.ui.comp.smarttable.SmartTable', true);
      },

      rebindTable: function() {
        this.getSmartTable().rebindTable();
      },

      _enableActions: function() {
        if (!this.oConfig.tableAccessControl) {
          return;
        }

        // reset
        this.getViewModel().setProperty('/tableActionEnabled', {});

        // iterate actions
        for (var sAction in this.oConfig.tableAccessControl) {
          // get AC property
          var oAccessControl = this.oConfig.tableAccessControl[sAction];
          Assert.ok(oAccessControl, 'SmartTableController failed to enable actions. no AC property for ' + sAction);

          // get action
          var oAction = this.oConfig.actions[sAction];
          Assert.ok(oAction, 'SmartTableController failed to enable actions. no action for ' + sAction);

          // determine enabled
          var oTable = this.getSmartTable().getTable();
          var iCount = oTable.getSelectedContexts().length;
          var bEnabled =
            (oAction.oConfig.minContexts === -1 || iCount >= oAction.oConfig.minContexts) &&
            (oAction.oConfig.maxContexts === -1 || iCount <= oAction.oConfig.maxContexts);
          this.getViewModel().setProperty('/tableActionEnabled/' + sAction, bEnabled);
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
          Assert.ok(oObject.hasOwnProperty(oAccessControl), 'cannot check access control. object does not have property: ' + oAccessControl);
          return oObject[oAccessControl];
        } else if (typeof oAccessControl === 'boolean') {
          return oAccessControl;
        } else if (typeof oAccessControl === 'function') {
          return !!oAccessControl(oContext);
        } else {
          Assert.ok(false, 'cannot check access control. unhandled type of access control ' + oAccessControl);
        }
      }

      /*
           onBeforeRebindTable: function(oEvent) {
           var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));
           oUpdate.addExpands(this.getBindingExpands());
           oUpdate.addSelects(this.getBindingSelects());
           oUpdate.addSorters(this.getBindingSorters());
           oUpdate.addCustoms(this.getCustomParameters());
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
           }*/
    });
  }
);
