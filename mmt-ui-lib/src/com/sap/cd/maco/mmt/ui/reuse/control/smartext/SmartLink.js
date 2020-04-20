sap.ui.define(['sap/ui/comp/navpopover/SmartLink'], function(SmartLink) {
  'use strict';

  return SmartLink.extend('com.sap.cd.maco.mmt.ui.reuse.control.smartext.SmartLink', {
    renderer: {},

    metadata: {
      properties: {
        paramsMap: { invalidate: true, type: 'string', defaultValue: '' }
      }
    },

    init: function() {
      SmartLink.prototype.init.apply(this, arguments);
      this.attachEvent('beforePopoverOpens', this._onBeforePopoverOpens, this);
    },

    _onBeforePopoverOpens: function(oEvent) {
      var oEventParams = oEvent.getParameters();

      // apply params map
      var sParamsMap = this.getParamsMap();
      if (sParamsMap) {
        var oContext = this.getBindingContext();
        var oObject = oContext.getObject();
        var oParamsMap = this._parseParamsMap(sParamsMap);
        var oParams = this._getParams(oParamsMap, oObject);
        oEventParams.setSemanticAttributes(oParams);
      }

      // open
      oEventParams.open();
    },

    _parseParamsMap: function(sMap) {
      var oMap = {};
      var sTokens = sMap.split(',');
      for (var i = 0; i < sTokens.length; i++) {
        var sToken = sTokens[i].trim();
        var iIndex = sToken.indexOf('=');
        if (iIndex !== -1) {
          var sFrom = sToken.substring(0, iIndex).trim();
          var sTo = sToken.substring(iIndex + 1, sToken.length).trim();
          oMap[sFrom] = sTo;
        }
      }
      return oMap;
    },

    _getParams: function(oParamsMap, oObject) {
      var oParams = {};
      for (var sParam in oParamsMap) {
        var sTarget = oParamsMap[sParam];
        if (oObject.hasOwnProperty(sTarget)) {
          oParams[sParam] = oObject[sTarget];
        }
      }
      return oParams;
    }
  });
});
