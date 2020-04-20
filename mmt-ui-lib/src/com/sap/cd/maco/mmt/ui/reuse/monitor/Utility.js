sap.ui.define(["sap/ui/model/FilterOperator"], function(FilterOperator) {
	"use strict";
	return {
		
		/**
		 * Utility function to Get source array element with a given attribute (property) value
		 * @param {Array} aSourceArray - Search source
		 * @param {string} sAttribute - Attribute name
		 * @param {*} vValue - Attribute value to find
		 * @returns {object} Element or empty object, if search failed
		 * @public
		 */
		getObjectWithAttr: function (aSourceArray, sAttribute, vValue) {
			if (!Array.isArray(aSourceArray)) {
				return {};
			}

			return aSourceArray.find(function (oSourceElement) {
				return oSourceElement[sAttribute] === vValue;
			}) || {};
		},

		/**
		 * Function to override Filter Data with Contains operator for given properties 
		 * @public
		 * @param {Object} oFilterData - Filter Data Object
		 * @param {Array} aProperties - property array that needs to be updated
		 * @returns {String} Updated Filter Object
		 */
		modifyFilterDataWithContainsOperator: function (oFilterData, aProperties) {
			var bIsFilterDataChanged = false;

			aProperties.forEach(function (sProperty) {
				var aFilterItem = [];
				if (jQuery.isArray(oFilterData[sProperty].items) && oFilterData[sProperty].items.length > 0) {
					bIsFilterDataChanged = true;
					aFilterItem = oFilterData[sProperty].items;
					for (var intI = 0; intI < aFilterItem.length; intI++) {

						oFilterData[sProperty].ranges.push({
							exclude: false,
							keyField: sProperty,
							value1: aFilterItem[intI].key,
							value2: null,
							operation: FilterOperator.Contains,
							tokenText: "*" + aFilterItem[intI].key + "*"
						});
					}
					oFilterData[sProperty].items = [];
				} else {
					aFilterItem = oFilterData[sProperty].ranges;
					for (var intI = 0; intI < aFilterItem.length && aFilterItem[intI].operation === FilterOperator.EQ; intI++) {
						oFilterData[sProperty].ranges[intI].operation = FilterOperator.Contains;
						oFilterData[sProperty].ranges[intI].tokenText = "*" + aFilterItem[intI].tokenText.slice(1) + "*";
						bIsFilterDataChanged = true;
					}
				}
			});

			if (!bIsFilterDataChanged) {
				oFilterData = {};
			}
			return oFilterData;
		}
	};
});
