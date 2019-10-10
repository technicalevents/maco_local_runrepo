sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/_/ControlSearch'], function(ControlSearch) {
  'use strict';

  return ControlSearch.extend('com.sap.cd.maco.mmt.ui.reuse.message._.InputSearch', {
    constructor: function(oControl) {
      ControlSearch.prototype.constructor.call(this, oControl);
    },

    inputNames: [
      // sap.m.InputBase
      'sap.m.ComboBox',
      'sap.m.DatePicker',
      'sap.m.DateRangeSelection',
      'sap.m.DateTimePicker',
      'sap.m.Input',
      'sap.m.MaskInput',
      'sap.m.MultiInput',
      'sap.m.MultiComboBox',
      'sap.m.TextArea',
      'sap.m.TimePicker',

      // control
      'sap.m.StepInput', // has required property
      'sap.m.Select', // has no required property
      'sap.ui.unified.FileUploader', // has no required property

      // sap.ui.comp.smartfield.SmartField
      'sap.ui.comp.smartfield.SmartField',
      'sap.ui.comp.smartmultiinput.SmartMultiInput'

      // deprecated
      // 'sap.m.DateTimeInput'
    ],

    search: function() {
      var fnMatcher = function(oControl) {
        var sName = oControl.getMetadata().getName();
        return this.inputNames.indexOf(sName) !== -1;
      };

      return ControlSearch.prototype.search.call(this, fnMatcher.bind(this));
    }
  });
});
