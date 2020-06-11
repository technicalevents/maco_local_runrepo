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
			generateCustomParams: function (oNavigateParams, aAdditionalFilters, aCustomStatusKeys, aCustomStatusMapping, sStatusProperty,
				oResourceBundle) {
				var aCustomSelectionVariant = [];
				var aStatus = [];
				var oCustomParams;
				
				var oCurrentStatusDetails = this._getCurrentStatusDetails(oNavigateParams, sStatusProperty, aCustomStatusKeys, aCustomStatusMapping, oResourceBundle);
				var bIsCustomKey = oCurrentStatusDetails.IsCustomStatus;
				var aIndividualStatusKey = oCurrentStatusDetails.IndividualStatusKeys; 

				if (bIsCustomKey) {
					aStatus = this._getIndividualStatuses(aIndividualStatusKey, oResourceBundle);

					aStatus.forEach(function (sStatus) {
						this._generateCustomSelectionVariantFilter(aCustomSelectionVariant, sStatusProperty, sStatus);
					}.bind(this));

				} else {
					this._generateCustomSelectionVariantFilter(aCustomSelectionVariant, sStatusProperty, oNavigateParams[sStatusProperty]);
				}

				aAdditionalFilters.forEach(function (oAdditionalFilters) {
					this._generateCustomSelectionVariantFilter(aCustomSelectionVariant,
						oAdditionalFilters.property,
						oAdditionalFilters.value1,
						oAdditionalFilters.operator,
						oAdditionalFilters.value2);
				}.bind(this));

				oCustomParams = {
					selectionVariant: aCustomSelectionVariant,
					ignoreEmptyString: true
				};

				return oCustomParams;
			},

			/**
			 * Utility Method used to add Selection Filters in Additional Filters
			 * @public
			 * @param {object} oSelectionVariantParams Selection Variant Parameters
			 * @param {array} aAdditionalFilters Additional Filter Array
			 */
			addSelectionFilters: function (oSelectionVariantParams, aAdditionalFilters) {
				var aSelectOptionsPropertyNames = oSelectionVariantParams.getSelectOptionsPropertyNames();

				aSelectOptionsPropertyNames.forEach(function (sSelectOptionsPropertyName) {
					aAdditionalFilters.push({
						path: sSelectOptionsPropertyName,
						operator: "EQ",
						value1: "",
						sign: "I"
					});
				}.bind(this));
			},

			_getCurrentStatusDetails: function (oNavigateParams, sStatusProperty, aCustomStatusKeys, oCustomStatusMapping, oResourceBundle) {
				var sCustomKey;
				var aIndividualStatusKey = [];
				
				sCustomKey = aCustomStatusKeys.find(function (sCustomStatusKey) {
					return oNavigateParams[sStatusProperty] === this._getI18nText(sCustomStatusKey, oResourceBundle);
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
			_getIndividualStatuses: function (aIndividualStatusKey, oResourceBundle) {
				return aIndividualStatusKey.map(function (sIndividualStatusKey) {
					return this._getI18nText(sIndividualStatusKey, oResourceBundle);
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
			_generateCustomSelectionVariantFilter: function (aCustomSelectionVariant, sProperty, sValue1, sOperator, sValue2) {
				var oFilter = {
					path: sProperty,
					operator: !!sOperator ? sOperator : "EQ",
					value1: sValue1,
					sign: "I",
					value2: sValue2
				};

				aCustomSelectionVariant.push(oFilter);
			}
		};
	});