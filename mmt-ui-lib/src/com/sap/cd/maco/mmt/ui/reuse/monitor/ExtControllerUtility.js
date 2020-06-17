sap.ui.define([],
	function () {
		"use strict";

		return {

			/**
			 * Utility Method used to generate Custom Paramaters for Navigation
			 * @public
			 * @param {object} oNavigateParams Navigation Parameters
			 * @param {array} aAdditionalFilters Additional Filter Array
			 * @param {string} sCombinedStatusKey Combined Status Key
			 * @param {array} aIndividualStatusKey Individual Status Key Array
			 * @param {string} sStatusProperty Status Property
			 * @param {object} oResourceBundle ResourceBundle Object
			 */
			generateCustomParams: function (aNavigationFilters, oSelectionVariantParams) {
				var aCustomSelectionVariant = [];
				var oCustomParams;

				aNavigationFilters.forEach(function (oNavigationFilters) {
					this._generateCustomSelectionVariantFilter(aCustomSelectionVariant, oNavigationFilters);
				}.bind(this));

				this._addSelectionFilters(aCustomSelectionVariant, oSelectionVariantParams);

				oCustomParams = {
					selectionVariant: aCustomSelectionVariant,
					ignoreEmptyString: true
				};

				return oCustomParams;
			},
			
			/**
			 * Utility Method used to Navigation Filter details
			 * @public
			 * @param {object} oNavigateParams Navigation Parameters
			 * @param {array} aAdditionalFilters Additional Filter Array
			 * @param {array} aCustomStatusKeys Combined Status Key
			 * @param {array} aIndividualStatusKey Individual Status Key Array
			 * @param {object} oResourceBundle ResourceBundle Object
			 */
			getNavigationFilterDetails: function (oNavigateParams, aAdditionalFilters, aCustomStatusKeys, aCustomStatusMapping, oResourceBundle) {
				var aNavigationFilters = [];

				Object.keys(oNavigateParams).forEach(function (sKey) {
					if (oNavigateParams[sKey]) {
						var oCurrentStatusDetails = this._getCurrentStatusDetails(oNavigateParams[sKey], aCustomStatusKeys, aCustomStatusMapping,
							oResourceBundle);
						var bIsCustomKey = oCurrentStatusDetails.IsCustomStatus;
						var aIndividualStatusKey = oCurrentStatusDetails.IndividualStatusKeys;

						if (bIsCustomKey) {
							aNavigationFilters = this._getIndividualStatusesFilter(sKey, aIndividualStatusKey, oResourceBundle);
						} else {
							aNavigationFilters.push({
								Property: sKey,
								Value1: oNavigateParams[sKey]
							});
						}
					}
				}.bind(this));

				aAdditionalFilters.forEach(function (oAdditionalFilters) {
					aNavigationFilters.push({
						Property: oAdditionalFilters.property,
						Value1: oAdditionalFilters.value1,
						Operator: oAdditionalFilters.operator,
						Value2: oAdditionalFilters.value
					});
				}.bind(this));

				return aNavigationFilters;
			},

			/**
			 * Utility Method used to add Selection Filters in Additional Filters
			 * @private
			 * @param {object} oSelectionVariantParams Selection Variant Parameters
			 * @param {array} aAdditionalFilters Additional Filter Array
			 */
			_addSelectionFilters: function (aCustomSelectionVariant, oSelectionVariantParams) {
				var aSelectOptionsPropertyNames = oSelectionVariantParams.getSelectOptionsPropertyNames();

				aSelectOptionsPropertyNames.forEach(function (sSelectOptionsPropertyName) {
					aCustomSelectionVariant.push({
						path: sSelectOptionsPropertyName,
						operator: "EQ",
						value1: "",
						sign: "I"
					});
				}.bind(this));
			},
			
			/**
			 * Utility Method to get Current Status Details 
			 * @public
			 * @param {object} sStatusProperty Status Property
			 * @param {array} aCustomStatusKeys Custom Status Keys
			 * @param {object} oCustomStatusMapping Custom Status Mapping
			 * @param {object} oResourceBundle Additional Filter Array
			 */
			_getCurrentStatusDetails: function (sStatusProperty, aCustomStatusKeys, oCustomStatusMapping, oResourceBundle) {
				var sCustomKey;
				var aIndividualStatusKey = [];

				sCustomKey = aCustomStatusKeys.find(function (sCustomStatusKey) {
					return sStatusProperty === (oResourceBundle ? this._getI18nText(sCustomStatusKey, oResourceBundle) : sCustomStatusKey);
				}.bind(this));

				if (sCustomKey) {
					aIndividualStatusKey = oCustomStatusMapping[sCustomKey];
				}

				return {
					IsCustomStatus: !!sCustomKey,
					IndividualStatusKeys: aIndividualStatusKey
				};
			},

			/**
			 * Utility Method used to get individual Status from status i18nkey
			 * @private
			 * @param {array} aIndividualStatusKey Individual Status Key Array
			 * @param {object} oResourceBundle ResourceBundle Object
			 */
			_getIndividualStatusesFilter: function (sProperty, aIndividualStatusKey, oResourceBundle) {
				return aIndividualStatusKey.map(function (sIndividualStatusKey) {
					return {
						Property: sProperty,
						Value1: oResourceBundle ? this._getI18nText(sIndividualStatusKey, oResourceBundle) : sIndividualStatusKey
					};
				}.bind(this));
			},

			/**
			 * Utility Method used to get i18n text from i18nkey
			 * @private
			 * @param {string} sI18nKey i18n Key
			 * @param {object} oResourceBundle ResourceBundle Object
			 */
			_getI18nText: function (sI18nKey, oResourceBundle) {
				return oResourceBundle.getText(sI18nKey);
			},

			/**
			 * Utility Method to generate Custom Selection Variant Filter
			 * @private
			 * @param {array} aCustomSelectionVariant Navigation Parameters
			 * @param {string} sProperty Filter Property Name
			 * @param {string} sValue Filter Property value
			 */
			_generateCustomSelectionVariantFilter: function (aCustomSelectionVariant, oNavigationFilters) {
				var oFilter = {
					path: oNavigationFilters.Property,
					operator: !!oNavigationFilters.Operator ? oNavigationFilters.Operator : "EQ",
					value1: oNavigationFilters.Value1,
					sign: "I",
					value2: oNavigationFilters.Value2
				};

				aCustomSelectionVariant.push(oFilter);
			}
		};
	});