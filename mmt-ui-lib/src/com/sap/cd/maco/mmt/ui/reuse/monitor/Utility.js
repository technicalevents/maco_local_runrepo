sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
	"sap/ui/model/odata/ODataUtils",
	"sap/ui/model/FilterOperator"
], function (Constants, ODataUtils, FilterOperator) {
	"use strict";

	return {
		/**
		 * Utility Function is used to convert record id into guid format
		 * @public
		 * @param {String} sId id to be converted into GUID format
		 * @returns {String} id into GUID format
		 */
		convertToGuidFormat: function (sId) {
			return sId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5").toLowerCase();
		},

		/**
		 * Utility Function is used to check whether id is in guid format or not 
		 * @public
		 * @param   {String}   sId     id to be checked
		 * @returns {String}           whether id is in guid format or not
		 */
		isGuid: function (sId) {
			var sRegex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
			var oMatch = sRegex.exec(sId);
			return oMatch != null;
		},

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
		 * Function generates a random GUID
		 * @public
		 * @returns {String} guid
		 */
		generateGuid: function () {
			function r() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(
					1);
			}
			return r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() +
				r();
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
				oFilterData = {}
			}

			return oFilterData;
		}
	};

});
