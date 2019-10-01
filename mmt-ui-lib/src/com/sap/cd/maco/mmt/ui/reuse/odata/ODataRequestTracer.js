/* eslint no-console: "off"  */
sap.ui.define(['jquery.sap.global', 'sap/ui/base/Object'], function(jQuery, Object) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.odata.ODataRequestTracer', {
    constructor: function(model) {
      Object.apply(this);
      this._model = model;
      this._aLog = [];
      this._model.attachEvent('requestCompleted', this._onRequest, this);
      this._model.attachEvent('requestFailed', this._onRequest, this);
    },

    destroy: function() {
      this._model.detachEvent('requestCompleted', this._onRequest, this);
      this._model.detachEvent('requestFailed', this._onRequest, this);
    },

    _output: function() {
      console.group('ODATA BATCH (' + new Date().toLocaleTimeString('en-US') + ')');

      for (var i = 0; i < this._aLog.length; i++) {
        var oLog = this._aLog[i];

        // call
        console.groupCollapsed(oLog.method + ' ' + oLog.url + ' (' + oLog.statusCode + ')');

        // params
        console.group('PARAMS');
        for (var j = 0; j < oLog.params.length; j++) {
          console.dir(oLog.params[j]);
        }
        console.groupEnd();

        // objects
        console.group('OBJECTS');
        if (oLog.objects.length === 0) {
          console.log('no objects found');
        } else {
          oLog.objects.forEach(function(d) {
            console.dir(d);
          });
        }
        console.groupEnd();

        console.groupEnd();
      }

      console.groupEnd();

      // reset
      this._aLog = [];
      this._triggeredOutput = false;
    },

    _onRequest: function(oEvent) {
      var oLog = {};
      var params = oEvent.getParameters();

      // There's a situation that the request is completed but with error result, no.method or response in the params
      if (!params.success) {
        if (params.errorobject) {
          return;
        }
      }

      // set url/params
      try {
        oLog.method = params.method;
        oLog.statusCode = params.response.statusCode;
        var sUrl = params.url;
        sUrl = decodeURIComponent(sUrl);
        var indexOfParams = sUrl.indexOf('?');
        if (indexOfParams) {
          oLog.url = sUrl.substring(0, indexOfParams);
          var sParams = sUrl.substring(indexOfParams + 1, sUrl.length);
          oLog.params = sParams.split('&$');
        } else {
          oLog.url = sUrl;
          oLog.params = ['no params'];
        }
      } catch (e) {
        oLog.url = '?';
        oLog.params = ['?'];
      }

      // set objects
      try {
        var response = oEvent.getParameter('response');
        var responseText = response.responseText;
        var data = JSON.parse(responseText);
        if (data.d.results) {
          oLog.objects = data.d.results;
        } else {
          oLog.objects = [data.d];
        }
      } catch (e) {
        oLog.objects = [];
      }

      // trigger log
      this._aLog.push(oLog);
      if (!this._triggeredOutput) {
        this._triggeredOutput = true;
        setTimeout(this._output.bind(this), 0);
      }
    }
  });
});
