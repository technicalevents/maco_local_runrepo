sap.ui.define(
  [
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(JSONModel, bundle, ListReportController, SmartTableBindingUpdate, Assert) {
    'use strict';

    return ListReportController.extend('com.sap.cd.maco.mmt.ui.reuse.controller.listReport.ListReportDraftController', {
      //~~~~ init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      onInit: function(oConfig) {
        // super
        ListReportController.prototype.onInit.apply(this, arguments);

        // attach filter bar events
        var oFilterBar = this.getFilterBar();
        oFilterBar.attachEvent('afterVariantLoad', this._onAfterVariantLoad, this);
        oFilterBar.attachEvent('beforeVariantFetch', this._onBeforeVariantFetch, this);

        // attach draft status filter events
        var oStatusFilter = this.getDraftStatusFilter();
        if (oStatusFilter) {
          oStatusFilter.attachEvent('change', this._onDraftStatusFilterChange, this);
        }

        // attach table events
        var oTable = this.getSmartTable();
        oTable.attachEvent('beforeRebindTable', this._onBeforeRebindTable, this);
      },

      getDraftStatusFilter: function() {
        return this.getConfigControl('draftStatusFilter', 'com.sap.cd.maco.mmt.ui.reuse.control.draft.DraftStatusFilter', false);
      },

      //~~~~ filter bar ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _onAfterVariantLoad: function(oEvent) {
        var oFilter = this.getDraftStatusFilter();
        if (!oFilter) {
          return;
        }
        var oBar = oEvent.getSource();
        var oData = oBar.getFilterData();
        if (oData && oData._CUSTOM && oData._CUSTOM.editingStatusKey) {
          oFilter.setSelectedKey(oData._CUSTOM.editingStatusKey);
        }
      },

      _onBeforeVariantFetch: function(oEvent) {
        var oFilter = this.getDraftStatusFilter();
        if (!oFilter) {
          return;
        }
        var oBar = oEvent.getSource();
        var oData = oBar.getFilterData();
        oData._CUSTOM = {
          editingStatus: oFilter.getSelectedKey()
        };
        oBar.setFilterData(oData);
      },

      _onDraftStatusFilterChange: function(oEvent) {
        // rebind table
        var oTable = this.getSmartTable();
        oTable.rebindTable();

        // set variant modified
        var oVariantMgmt = this.getVariantManagement();
        if (oVariantMgmt) {
          oVariantMgmt.currentVariantSetModified();
        }
      },

      _onBeforeRebindTable: function(oEvent) {
        var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));

        // expand
        oUpdate.addExpand('DraftAdministrativeData');

        // select
        oUpdate.addSelects(['IsActiveEntity', 'HasDraftEntity', 'HasActiveEntity', 'DraftAdministrativeData', 'ActiveUUID']);

        // filter
        var oSelect = this.getDraftStatusFilter();
        var sFilter = oSelect ? oSelect.getSelectedKey() : 'all';
        if (sFilter === 'all') {
          oUpdate.addFilter('IsActiveEntity', 'EQ', false);
          oUpdate.addFilter('SiblingEntity/IsActiveEntity', 'EQ', null);
          oUpdate.endFilterOr();
        } else if (sFilter === 'own') {
          oUpdate.addFilter('IsActiveEntity', 'EQ', false);
          oUpdate.endFilterAnd();
        } else if (sFilter === 'locked') {
          oUpdate.addFilter('IsActiveEntity', 'EQ', true);
          oUpdate.addFilter('SiblingEntity/IsActiveEntity', 'EQ', null);
          oUpdate.addFilter('DraftAdministrativeData/InProcessByUser', 'NE', '');
          oUpdate.endFilterAnd();
        } else if (sFilter === 'unsaved') {
          oUpdate.addFilter('IsActiveEntity', 'EQ', true);
          oUpdate.addFilter('SiblingEntity/IsActiveEntity', 'EQ', null);
          oUpdate.addFilter('DraftAdministrativeData/InProcessByUser', 'EQ', '');
          oUpdate.endFilterAnd();
        } else if (sFilter === 'unchanged') {
          oUpdate.addFilter('IsActiveEntity', 'EQ', true);
          oUpdate.addFilter('HasDraftEntity', 'EQ', false);
          oUpdate.endFilterAnd();
        } else {
          Assert.ok(false, 'unhandled filter: ' + sFilter);
        }
      }
    });
  }
);
