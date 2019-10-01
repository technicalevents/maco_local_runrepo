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
		 * Utility Function is used to fetch semantic object name
		 * @private
		 * @param {object} sBusinessObjectType Business Object Type name
		 * @returns {string} Semantic object name
		 */
		getSemanticObject: function(sBusinessObjectType){
			var sSemanticObject;
			
			switch (sBusinessObjectType) {
				case Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT:
					sSemanticObject = Constants.SEMANCTIC_OBJECT.PROCESS_DOCUMENT;           
					break;
	
				case Constants.BO_OBJECT_TYPE.TRANSFER_DOCUMENT:
				case Constants.BO_OBJECT_TYPE.APERAK_MSG:
				case Constants.BO_OBJECT_TYPE.CONTRL_MSG:
					sSemanticObject = Constants.SEMANCTIC_OBJECT.TRANSFER_DOCUMENT; 
					break;
					
				default:
					sSemanticObject =  null;  
					break;
			}
	
			return sSemanticObject;
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
		 * Utility Function used to get navigation parameters
		 * @param {string} sBusinessObjectType - Business Object Type
		 * @param {string} sDocumentKey - Document key
		 * @param {string} sProcessID   - Process ID
		 * @public
		 * @returns {object} Object having KeyField (GUID) for cross App Navigation
	   	 */
		   getNavigationParameters: function(sBusinessObjectType, sDocumentKey, sProcessID){
			var sSemanticObject = this.getSemanticObject(sBusinessObjectType);
			var oParam = {};
			
			if (sBusinessObjectType === Constants.BO_OBJECT_TYPE.PROCESS_DOCUMENT){
				oParam.ProcessDocumentKey = sDocumentKey;
				oParam.ProcessID = sProcessID;
			} else {
				oParam.TransferDocumentKey = sDocumentKey;
			}
			
			return oParam;
		},

		/**
		 * Get filter string from array of sap.ui.model.Filter objects
		 * @public
		 * @param {sap.ui.model.odata.ODataModel} oODataModel ODATA model reference
		 * @param {string}                 sEntityName   Name of EntitySet
		 * @param {sap.ui.model.Filter[]}  aFilter       Array of Filters
         * @returns {string}                             Filter String
		 */
		createODataFilterString: function (oODataModel, sEntitySet, aFilter) {
			var oMetadata = oODataModel.oMetadata;
			var oEntityType = this.getEntityTypeBySetName(oODataModel, sEntitySet);
			
			return ODataUtils.createFilterParams(aFilter, oMetadata, oEntityType);
		},
		
		/**
		 * Get detailed info about entity type based on corresponding entity set
		 * @param {sap.ui.model.odata.v2.ODataModel} oOdataModel - ODATA model reference
		 * @param {string} sEntitySet - Name of the corresponding entity set
		 * @returns {Object} Detailed info about entity type
		 * @private
		 */
		getEntityTypeBySetName: function(oOdataModel, sEntitySet) {
			var oMetaModel = oOdataModel.getMetaModel();
			var oEntitySet = oMetaModel.getODataEntitySet(sEntitySet);
			
			return oEntitySet ? oMetaModel.getODataEntityType(oEntitySet.entityType) : {};
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