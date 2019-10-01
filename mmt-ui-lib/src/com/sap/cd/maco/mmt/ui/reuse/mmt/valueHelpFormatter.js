sap.ui.define(["com/sap/cd/maco/mmt/ui/reuse/mmt/valueHelpValues"], function(valueHelpValues) {
  "use strict";

  var fnGetText = function(sKey, sId) {
    for (var i = 0; i < valueHelpValues[sKey].length; i++) {
      if (valueHelpValues[sKey][i].id === sId) {
        return valueHelpValues[sKey][i].text;
      }
    }
    return "? (" + sId + ")";
  };

  /**
   * The goal of this file is to abstract on how the resource bundle is accessed.
   * This differs if the reuse code runs in a real reuse lib or is copied to an app.
   */
  return {
    division: function(sId) {
      return fnGetText("divisions", sId);
    },
    marketRole: function(sId) {
      return fnGetText("marketRoles", sId);
    },
    fileContentType: function(sId) {
      return fnGetText("fileContentTypes", sId);
    },
    beConnectionType: function(sId) {
      return fnGetText("beConnectionTypes", sId);
    },
    extConnectionType: function(sId) {
      return fnGetText("extConnectionTypes", sId);
    },
    emailProtocol: function(sId) {
      return fnGetText("emailProtocols", sId);
    },
    emailConnStatus: function(sId) {
      return fnGetText("emailConnStatus", sId);
    },
    keyPairStatus: function(sId) {
      return fnGetText("keyPairStatus", sId);
    },
    beConnectionStatus: function(sId) {
      return fnGetText("beConnectionStatus", sId);
    },
    ProtectforRevEmail: function(sId) {
      return fnGetText("ProtectforRevEmail", sId);
    },
    ProtectforSendEmail: function(sId) {
      return fnGetText("ProtectforSendEmail", sId);
    },
    AuthforRevEmail: function(sId) {
      return fnGetText("AuthforRevEmail", sId);
    },
    AuthforSendEmail: function(sId) {
      return fnGetText("AuthforRevEmail", sId);
    }
  };
});
