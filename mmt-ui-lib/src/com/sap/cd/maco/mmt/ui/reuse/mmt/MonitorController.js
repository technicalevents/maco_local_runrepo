sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/controller/listReport/ListReportNoDraftController',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/table/SmartTableBindingUpdate',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(ListReportNoDraftController, SmartTableBindingUpdate, Assert) {
    'use strict';

    return ListReportNoDraftController.extend('com.sap.cd.maco.mmt.ui.reuse.mmt.MonitorController', {
      onInit: function(oConfig) {
        ListReportNoDraftController.prototype.onInit.call(this, oConfig);
        Assert.ok(this.oConfig.dateRangeProperty, 'Cannot init MonitorController. The dateRangeProperty not set');
        this._setDefaultDateRange();
      },

      _setDefaultDateRange: function() {
        var ofilterDateRange = this.byId('filterDateRange');
        ofilterDateRange.setSelectedKey('03');
        this._setDateFromToEnable();
      },

      _setDateFromToEnable: function() {
        // input for data from and to are only visible for date range = "05:Custom"
        var sRangeKey = this.byId('filterDateRange').getSelectedKey();
        var bFromToVisible = sRangeKey === '05';
        var oFilterDateFrom = this.byId('filterDateRangeFrom');
        var oFilterDateTo = this.byId('filterDateRangeTo');
        oFilterDateFrom.setVisible(bFromToVisible);
        oFilterDateTo.setVisible(bFromToVisible);
      },

      onFilterDateRangeChanged: function(oEvent) {
        this._setDateFromToEnable();
      },

      setFilterDateFromTo: function(oSmartTableBindingUpdate) {
        var sRangeKey = this.byId('filterDateRange').getSelectedKey();
        var dFrom, dTo;

        switch (sRangeKey) {
          case '00': //none
            dTo = null;
            dFrom = null;
            break;
          case '01': //Past Minute
            dTo = new Date();
            dFrom = new Date(new Date().getTime() - 60 * 1000);
            break;
          case '02': //Past Hour
            dTo = new Date();
            dFrom = new Date(new Date().getTime() - 60 * 60 * 1000);
            break;

          case '03': //Past 24 Hour
            dTo = new Date();
            dFrom = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
            break;

          case '04': //Past 24 week
            dTo = new Date();
            dFrom = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
            break;

          case '05': //custom
            dFrom = this.byId('filterDateRangeFromPicker').getDateValue();
            dTo = this.byId('filterDateRangeToPicker').getDateValue();
            break;
        }

        if (dFrom) {
          oSmartTableBindingUpdate.addFilter(this.oConfig.dateRangeProperty, 'GE', dFrom);
        }

        if (dTo) {
          oSmartTableBindingUpdate.addFilter(this.oConfig.dateRangeProperty, 'LE', dTo);
        }

        //not select all time range
        if (dFrom || dTo) {
          oSmartTableBindingUpdate.endFilterAnd();
        }
      },

      /**
       * Update the custom filters after a variant has been loaded
       */
      onAfterVariantLoad: function(oEvent) {
        var oBar = oEvent.getSource();
        var oData = oBar.getFilterData();
        var oDateRange = this.byId('filterDateRange');
        var sKey;
        if (oData && oData._CUSTOM && oData._CUSTOM[this.oConfig.dateRangeProperty]) {
          sKey = oData._CUSTOM[this.oConfig.dateRangeProperty];
          oDateRange.setSelectedKey(sKey);
        }
      },

      /**
       * Add the custom filters before a variant is saved
       */
      onBeforeVariantFetch: function(oEvent) {
        var oBar = oEvent.getSource();
        var oData = oBar.getFilterData();
        var oDateRange = this.byId('filterDateRange');
        var sKey = oDateRange.getSelectedKey();
        oData._CUSTOM = {};
        oData._CUSTOM[this.oConfig.dateRangeProperty] = sKey;
        oBar.setFilterData(oData);
      }
    });
  }
);
