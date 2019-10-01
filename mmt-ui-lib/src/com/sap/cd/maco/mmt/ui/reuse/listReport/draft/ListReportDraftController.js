sap.ui.define(
  [
    'sap/ui/model/json/JSONModel',
    'com/sap/cd/maco/mmt/ui/reuse/_/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/table/SmartTableController',
    'com/sap/cd/maco/mmt/ui/reuse/table/SmartTableBindingUpdate',
    'com/sap/cd/maco/mmt/ui/reuse/_/getConfigControl'
  ],
  function(JSONModel, bundle, SmartTableController, SmartTableBindingUpdate, getConfigControl) {
    'use strict';

    return SmartTableController.extend('com.sap.cd.maco.mmt.ui.reuse.listReport.draft.ListReportDraftController', {
      //~~~~ init ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      onInit: function(oConfig) {
        SmartTableController.prototype.onInit.apply(this, arguments);

        this.oConfig = oConfig;

        // check config
        this.oAssert.ok(oConfig, 'ListReportDraftController cannot init. config missing');
        this.oAssert.ok(oConfig.controls, 'ListReportDraftController cannot init. controls missing');

        // attach filter bar events
        var oFilterBar = this._getFilterBar();
        oFilterBar.attachEvent('afterVariantLoad', this._onAfterVariantLoad, this);
        oFilterBar.attachEvent('beforeVariantFetch', this._onBeforeVariantFetch, this);

        // attach draft status filter events
        var oStatusFilter = this._getDraftStatusFilter();
        if (oStatusFilter) {
          oStatusFilter.attachEvent('change', this._onDraftStatusFilterChange, this);
        }
      },

      _getVariantManagement: function() {
        return getConfigControl(this, 'variantManagement', 'sap.ui.comp.smartvariants.SmartVariantManagement', false);
      },

      _getFilterBar: function() {
        return getConfigControl(this, 'filterBar', 'sap.ui.comp.smartfilterbar.SmartFilterBar', true);
      },

      _getDraftStatusFilter: function() {
        return getConfigControl(this, 'draftStatusFilter', 'com.sap.cd.maco.mmt.ui.reuse.listReport.draft.DraftStatusFilter', false);
      },

      //~~~~ filter bar ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      _onAfterVariantLoad: function(oEvent) {
        var oFilter = this._getDraftStatusFilter();
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
        var oFilter = this._getDraftStatusFilter();
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
        var oTable = this._getSmartTable();
        oTable.rebindTable();

        // set variant modified
        var oVariantMgmt = this._getVariantManagement();
        if (oVariantMgmt) {
          oVariantMgmt.currentVariantSetModified();
        }
      },

      onBeforeRebindTable: function(oEvent) {
        var oUpdate = new SmartTableBindingUpdate(oEvent.getParameter('bindingParams'));

        // expand
        oUpdate.addExpand('DraftAdministrativeData');

        // select
        oUpdate.addSelects(['IsActiveEntity', 'HasDraftEntity', 'HasActiveEntity', 'DraftAdministrativeData']);

        // filter
        var oSelect = this._getDraftStatusFilter();
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
          this.oAssert.ok(false, 'unhandled filter: ' + sFilter);
        }
      }
    });
  }
);
