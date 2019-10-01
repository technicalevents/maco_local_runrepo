sap.ui.define(['sap/ui/base/Object'], function(Object) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.ControlSearch', {
    constructor: function(control, bAbortOnMatch) {
      this._control = control;
      this._bAbortOnMatch = bAbortOnMatch;
    },

    search: function(fnMatcher) {
      var aResult = [];
      this._search(this._control, fnMatcher, aResult);
      return aResult;
    },

    _search: function(oControl, fnMatcher, aResult) {
      // get aggregations
      var oMetadata = oControl.getMetadata();
      var oAggregationNames = oMetadata.getAllAggregations();

      // iterate aggregations
      for (var sAggregationName in oAggregationNames) {
        var aContent = oControl.getAggregation(sAggregationName);

        // special handling for SimpleForm
        // (generic aggregation access fails for content aggregation due to internal implementation, i am so sorry Sebastian)
        var sControlName = oControl.getMetadata().getName();
        if (sControlName === 'sap.ui.layout.form.SimpleForm' && sAggregationName === 'content') {
          aContent = oControl.getContent();
        }
        //Added as not working for version 1.52.1
        if (sControlName === 'sap.ui.comp.smartform.SmartForm' && sAggregationName === 'groups') {
          aContent = oControl.getGroups();
        }

        // skip empty aggregations
        if (!aContent) {
          continue;
        }

        // convert single objects to arrays
        if (!aContent.forEach) {
          aContent = [aContent];
        }

        // iterate aggregation content
        aContent.forEach(
          function(oContent) {
            // skip stuff w/o metadata
            if (!oContent.getMetadata) {
              return;
            }

            // add control if a match
            var bMatch = fnMatcher(oContent);
            if (bMatch) {
              aResult.push(oContent);
            }

            // step down into recursion
            if (!(this._bAbortOnMatch && bMatch)) {
              this._search(oContent, fnMatcher, aResult);
            }
          }.bind(this)
        );
      }
    }
  });
});
