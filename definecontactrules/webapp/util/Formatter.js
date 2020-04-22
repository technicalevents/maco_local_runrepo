sap.ui.define([
  "com/sap/cd/maco/mmt/ui/reuse/formatter/criticality",
  "sap/base/strings/formatMessage",
  "com/sap/cd/maco/mmt/ui/reuse/monitor/valueHelpFormatter"
], function (criticality, formatMessage, valueHelpFormatter) {
	"use strict";
	return {
    	criticality: criticality,
		formatMessage: formatMessage,
		valueHelpFormatter: valueHelpFormatter
	};
});