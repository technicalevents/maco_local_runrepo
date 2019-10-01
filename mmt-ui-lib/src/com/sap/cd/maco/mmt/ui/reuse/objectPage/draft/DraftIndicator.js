sap.ui.define(['sap/ui/core/Control', 'sap/m/DraftIndicator'], function(Control, DraftIndicator) {
  'use strict';

  return Control.extend('com.sap.cd.maco.mmt.ui.reuse.draft.DraftIndicator', {
    metadata: {
      properties: {},
      aggregations: {
        _indicator: {
          type: 'sap.m.DraftIndicator',
          multiple: false,
          visibility: 'hidden'
        }
      },
      events: {}
    },

    init: function() {
      var oMarker = this._initMarker();
      this.setAggregation('_indicator', oMarker);
    },

    _initMarker: function() {
      return new DraftIndicator({
        state: {
          path: 'app>/draft/state',
          formatter: this._formatState
        }
      });
    },

    _formatState: function(sState) {
      if (sState === 'saved') {
        return 'Saved';
      } else if (sState === 'saving') {
        return 'Saving';
      } else if (sState === 'clear') {
        return 'Clear';
      } else {
        throw new Error('unknown state ' + sState);
      }
    },

    renderer: function(oRM, oControl) {
      // i just found no easier or more public way to pass the style classes
      // (i overwrote addStyleClass but it was called only once for the template of an aggregation)
      var oMarker = oControl.getAggregation('_indicator');
      if (oControl.aCustomStyleClasses) {
        oControl.aCustomStyleClasses.forEach(function(sClass) {
          oMarker.addStyleClass(sClass);
        });
      }
      // render marker
      oRM.renderControl(oMarker);
    }
  });
});
