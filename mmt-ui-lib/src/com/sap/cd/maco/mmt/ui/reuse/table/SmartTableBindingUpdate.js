sap.ui.define(['sap/ui/base/Object', 'sap/ui/model/Filter'], function(Object, Filter) {
  'use strict';

  /**
   * Wraps the logic to update the binding of a smart table
   *
   * See Also: Smart Table @ https://sapui5.hana.ondemand.com/sdk/#docs/guide/bed8274140d04fc0b9bcb2db42d8bac2.html
   */
  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.table.SmartTableBindingUpdate', {
    constructor: function(params) {
      if (!params) {
        throw new Error('Failed to instantiate. params missing');
      }
      this._oParams = params;
      this._aFilters = [];
      this._bPrevent = false;
    },

    addCustom: function(sKey, sValue) {
      if (!this._oParams.parameters) {
        this._oParams.parameters = {};
      }
      if (!this._oParams.parameters.custom) {
        this._oParams.parameters.custom = {};
      }
      this._oParams.parameters.custom[sKey] = sValue;
    },

    addCustoms: function(aCustoms) {
      for (var i = 0; i < aCustoms.length; i++) {
        this.addCustom(aCustoms[i].key, aCustoms[i].value);
      }
    },

    addSelect: function(sProperty) {
      var aParams = [];
      if (this._oParams.parameters.select) {
        aParams = this._oParams.parameters.select.split(',');
      }
      if (aParams.indexOf(sProperty) === -1) {
        aParams.push(sProperty);
        this._oParams.parameters.select = aParams.toString();
      }
    },

    addSelects: function(aProperties) {
      for (var i = 0; i < aProperties.length; i++) {
        this.addSelect(aProperties[i]);
      }
    },

    addExpand: function(sProperty) {
      var aParams = [];
      if (this._oParams.parameters.expand) {
        aParams = this._oParams.parameters.expand.split(',');
      }
      if (aParams.indexOf(sProperty) === -1) {
        aParams.push(sProperty);
        this._oParams.parameters.expand = aParams.toString();
      }
    },

    addExpands: function(aProperties) {
      for (var i = 0; i < aProperties.length; i++) {
        this.addExpand(aProperties[i]);
      }
    },

    prevent: function() {
      this._oParams.preventTableBind = true;
    },

    enableCountMode: function() {
      if (!this._oParams.parameters) {
        this._oParams.parameters = {};
      }
      this._oParams.parameters.countMode = 'Request';
    },

    addSorter: function(oSorter) {
      if (!this._oParams.sorter) {
        this._oParams.sorter = [];
      }
      this._oParams.sorter.push(oSorter);
    },

    addSorters: function(aSorter) {
      for (var i = 0; i < aSorter.length; i++) {
        this.addSorter(aSorter[i]);
      }
    },

    addFilter: function(propertyName, operator, propertyValue) {
      if (propertyValue === undefined) {
        this._bPrevent = true;
      } else {
        var bHasFilter = this._hasFilter(this._oParams.filters, propertyName);
        if (!bHasFilter) {
          this._aFilters.push(new Filter(propertyName, operator, propertyValue));
        }
      }
    },

    endFilterAnd: function() {
      this._endFilter(true);
    },

    endFilterOr: function() {
      this._endFilter(false);
    },

    _endFilter: function(bAnd) {
      if (this._bPrevent) {
        //if no property is known we don't need to call the backend at all
        //In such cases we avoid the rebinding
        this._oParams.preventTableBind = true;
      } else if (this._aFilters.length > 0) {
        // array might be empty even if addFilter was called before

        // add filter
        var oOwnMultiFilter = new Filter(this._aFilters, bAnd);

        //Special handling for multiple multi-filters
        if (this._oParams.filters[0] && this._oParams.filters[0].aFilters) {
          var oSmartTableMultiFilter = this._oParams.filters[0];
          // if an internal multi-filter exists then combine custom multi-filters and internal multi-filters with an AND
          this._oParams.filters[0] = new Filter([oSmartTableMultiFilter, oOwnMultiFilter], true);
        } else {
          this._oParams.filters.push(oOwnMultiFilter);
        }
      }

      // reset
      this._aFilters = [];
    },

    /** This function recursively checks if the filterArray contains a filter object for a property
     * The filterArray might be a deeply nested array of arrays or objects.
     * @param {sap.ui.model.Filter[]} filters filters
     * @param {string} propertyName The name of the property to be filtered
     * @returns {boolean} boolean
     */
    _hasFilter: function(filters, propertyName) {
      var hasFilter = false;

      //definition of recursive function
      var myFunction = function(item, index) {
        // console.log("myFunction: " + item + ", " + index);

        if (item.aFilters) {
          item.aFilters.forEach(myFunction);
        }

        if (item.sPath && item.sPath === propertyName) {
          hasFilter = true;
        }
      };

      // call of recursive function for each entry in filterArray
      if (filters) {
        filters.forEach(myFunction);
      }

      return hasFilter;
    }
  });
});
