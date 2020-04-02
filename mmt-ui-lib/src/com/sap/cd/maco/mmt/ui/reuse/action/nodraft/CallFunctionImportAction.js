sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataResponseHandler',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert',
    'com/sap/cd/maco/mmt/ui/reuse/component/single/getMessage'
  ],
  function(BaseAction, bundle, ODataResponseHandler, Assert, getMessage) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.nodraft.CallFunctionImportAction', {
      constructor: function(oComponent, oConfig) {
        // default min
        if (oConfig && !oConfig.hasOwnProperty('minContexts')) {
          oConfig.minContexts = 1;
        }

        // super
        BaseAction.call(this, oComponent, oConfig);

        // default config
        if (!oConfig.method) {
          oConfig.method = 'GET';
        }
        if (!oConfig.hasOwnProperty('singleRequest')) {
          oConfig.singleRequest = false;
        }

        // check config
        Assert.ok(oConfig.name, 'cannot init CallFunctionImportAction. no name');
        Assert.ok(oConfig.method === 'GET' || oConfig.method === 'POST', 'cannot init CallFunctionImportAction. wrong method: ' + oConfig.method);
      },

      /**
       * @deprecated
       */
      enabled: function(aContexts) {
        return aContexts.length > 0;
      },

      execute: function(oParams) {
        this.assertContextParam(oParams);

        // check params
        if (!oParams.params) {
          oParams.params = {};
        }
        if (oParams.msgHandling) {
          if (!oParams.msgHandling.target) {
            // !!!!!!!!!!!!!!! view or fragment
          }
          if (!oParams.msgHandling.client) {
            oParams.msgHandling.client = true;
          }
          if (!oParams.msgHandling.server) {
            oParams.msgHandling.server = true;
          }
          if (!oParams.msgHandling.buttonId) {
          }
          if (!oParams.msgHandling.model) {
          }
        }

        return new Promise(
          function(resolve, reject) {
            this._oParams = oParams;
            this._fnResolve = resolve;
            this._fnReject = reject;
            this.oModel.metadataLoaded().then(this._execute.bind(this), reject);
          }.bind(this)
        );
      },

      _execute: function() {
        if (this.oConfig.singleRequest) {
          this._executeSingle();
        } else {
          this._executeMultiple();
        }
      },

      /*
       TODO automap params
       if (Array.isArray(this._oParams.contexts) && this._oParams.contexts.length > 0) {
       var oContext = this._oParams.contexts[0];
       var oObject = oContext.getObject();
       var oMeta = this.oModel.getMetaModel();
       var oFI = oMeta.getODataFunctionImport(this.oConfig.name);
       if (oFI) {
       // TODO
       }
       }
       */

      _executeMultiple: function() {
        // set busy
        if (this._oParams.busyControl) {
          this._oParams.busyControl.setBusy(true);
        }

        // listen to odata batch response
        new ODataResponseHandler({
          model: this.oModel,
          success: this._successMultipleEnd.bind(this),
          error: this._error.bind(this)
        });

        // reset results
        this._aResults = [];

        for (var i = 0; i < this._oParams.contexts.length; i++) {
          // map params
          var oParams = jQuery.extend({}, this._oParams.params);
          var oObject = this._oParams.contexts[i].getObject();
          if (this.oConfig.paramsMap) {
            for (var sToParam in this.oConfig.paramsMap) {
              var sFromParam = this.oConfig.paramsMap[sToParam];
              Assert.ok(
                oObject.hasOwnProperty(sFromParam),
                'cannot execute CallFunctionImportAction. cannot map params. object has no property ' + sFromParam
              );
              oParams[sToParam] = oObject[sFromParam];
            }
          }

          // send request
          this.oModel.callFunction('/' + this.oConfig.name, {
            method: this.oConfig.method,
            urlParameters: oParams,
            success: this._successMultiplePart.bind(this)
          });
        }
      },

      _successMultiplePart: function(oData, oResponse) {
        this._aResults.push({
          params: this._oParams,
          data: oData,
          response: oResponse
        });
      },

      _successMultipleEnd: function(oData, oResponse) {
        // reset busy indication
        if (this._oParams.busyControl) {
          this._oParams.busyControl.setBusy(false);
        }

        // show message
        this._showSuccessMessage();

        // resolve
        this._fnResolve(this._aResults);
      },

      _executeSingle: function() {
        // set busy
        if (this._oParams.busyControl) {
          this._oParams.busyControl.setBusy(true);
        }

        // map parameters
        if (this.oConfig.paramsMap) {
          for (var sToParam in this.oConfig.paramsMap) {
            var sFromParam = this.oConfig.paramsMap[sToParam];
            var sResult = '';
            for (var i = 0; i < this._oParams.contexts.length; i++) {
              var oObject = this._oParams.contexts[i].getObject();
              Assert.ok(
                oObject.hasOwnProperty(sFromParam),
                'cannot execute CallFunctionImportAction. cannot map params. object has no property ' + sFromParam
              );
              sResult += oObject[sFromParam];
              if (i < this._oParams.contexts.length - 1) {
                sResult += ',';
              }
            }
            this._oParams.params[sToParam] = sResult;
          }
        }

        // send request
        this.oModel.callFunction('/' + this.oConfig.name, {
          method: this.oConfig.method,
          urlParameters: this._oParams.params,
          success: this._successSingle.bind(this),
          error: this._error.bind(this)
        });
      },

      _successSingle: function(oData, oResponse) {
        // reset busy indication
        if (this._oParams.busyControl) {
          this._oParams.busyControl.setBusy(false);
        }

        // show message
        this._showSuccessMessage();

        // resolve
        this._fnResolve({
          params: this._oParams,
          data: oData,
          response: oResponse
        });
      },

      _error: function(oError) {
        // reset busy indication
        if (this._oParams.busyControl) {
          this._oParams.busyControl.setBusy(false);
        }
        this._fnReject(oError);
      },

      _showSuccessMessage: function() {
        var sMsg =
          this._oParams.contexts.length === 1
            ? this.getConfigText('successMsg1', 'transactionCallFunctionImportSuccess')
            : this.getConfigText('successMsgN', 'transactionCallFunctionImportSuccess');
        getMessage(this).success({
          msg: sMsg
        });
      }
    });
  }
);
