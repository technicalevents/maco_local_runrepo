sap.ui.define([
	"com/sap/cd/maco/mmt/ui/reuse/monitor/Constants",
	"sap/ui/model/odata/ODataUtils"
], function(Constants, ODataUtils) {
	"use strict";
	
	return {
		/**
		 * Utility Function is used to convert record id into guid format
		 * @public
		 * @param {String} sId id to be converted into GUID format
		 * @returns {String} id into GUID format
		 */
		convertToGuidFormat: function(sId) {
			return sId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, "$1-$2-$3-$4-$5").toLowerCase();
		},

		/**
		 * Utility Function is used to check whether id is in guid format or not 
		 * @public
		 * @param   {String}   sId     id to be checked
		 * @returns {String}           whether id is in guid format or not
		 */
		isGuid: function(sId) {
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
		getObjectWithAttr: function(aSourceArray, sAttribute, vValue) {
			if (!Array.isArray(aSourceArray)) {
				return {};
			}
			
			return aSourceArray.find(function(oSourceElement) {
				return oSourceElement[sAttribute] === vValue;
			}) || {};
		},

		/**
		 * Function generates a random GUID
		 * @public
		 * @returns {String} guid
		 */
		generateGuid: function() {
			function r() {
				return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(
					1);
			}
			return r() + r() + "-" + r() + "-" + r() + "-" + r() + "-" + r() + r() +
				r();
		}
	};

});