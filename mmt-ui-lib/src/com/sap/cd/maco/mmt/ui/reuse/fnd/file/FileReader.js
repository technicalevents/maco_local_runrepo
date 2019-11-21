/*global location*/
/* eslint no-undef: "off"  */

sap.ui.define(['sap/ui/base/Object'], function(Object) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.objects.file.FileReader', {
    constructor: function() {
      this._oReader = new FileReader();
      this._oReader.onload = this._onLoad.bind(this);
      this._oReader.onerror = this._onError.bind(this);
    },

    readBase64: function(params) {
      return new Promise(
        function(resolve, reject) {
          // keep references
          this._oFile = params.file;
          this._oBusyControl = params.busyControl;
          this._fnResolve = resolve;
          this._fnReject = reject;

          // handle empty file (happens on cancel of fileUpload)
          if (!this._oFile) {
            this._fnReject();
            return;
          }

          // set busy
          if (this._oBusyControl) {
            this._oBusyControl.setBusyIndicatorDelay(0);
            this._oBusyControl.setBusy(true);
          }

          // ! note that FileReader.readAsBinaryString does not work in IE11
          //   thus we use FileReader.readAsArrayBuffer and build the binary string ourselves
          this._oReader.readAsArrayBuffer(this._oFile);
        }.bind(this)
      );
    },

    _onError: function(e) {
      if (this._oBusyControl) {
        this._oBusyControl.setBusy(false);
      }
      jQuery.sap.log.error({ msg: 'Error on reading file. ' + e });
      this._fnReject();
    },

    _onLoad: function(oEvent) {
      if (this._oBusyControl) {
        this._oBusyControl.setBusy(false);
      }

      // result is an array buffer
      var oArrayBuffer = oEvent.target.result;

      // convert array buffer to binary
      var sBinary = '';
      var bytes = new Uint8Array(oArrayBuffer);
      for (var i = 0; i < bytes.byteLength; i++) {
        sBinary += String.fromCharCode(bytes[i]);
      }

      // encode binary with base64
      var sBase64Data = btoa(sBinary);

      // resolve
      this._fnResolve({
        data: sBase64Data
      });
    }
  });
});
