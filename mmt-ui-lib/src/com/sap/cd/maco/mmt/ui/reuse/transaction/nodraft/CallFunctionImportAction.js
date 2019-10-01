sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/base/BaseAction', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle'], function(BaseAction, bundle) {
  'use strict';

  return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.nodraft.CallFunctionImportAction', {
    constructor: function(oComponent, oConfig) {
      // if not specified by consumer the cardinality is 1..N
      var sCardinality = oConfig && oConfig.cardinality && oConfig.cardinality === '1' ? '1' : '1..N';

      // super
      BaseAction.call(this, oComponent, oConfig, sCardinality);

      // default config
      if (!oConfig.method) {
        oConfig.method = 'GET';
      }

      // check config
      this.oAssert.ok(oConfig.path, 'cannot create action. no path');
      this.oAssert.ok(oConfig.method === 'GET' || oConfig.method === 'POST', 'cannot create action. wrong method: ' + oConfig.method);
    },

    enabled: function(aContexts) {
      return aContexts.length > 0;
    },

    execute: function(oParams, oEvent, oController) {
      this.assertContextParam(oParams);

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
          this.oModel.metadataLoaded().then(
            function() {
              if (Array.isArray(oParams.contexts) && oParams.contexts.length > 0) {
                var oContext = oParams.contexts[0];
                var oObject = oContext.getObject();
                var oMeta = this.oModel.getMetaModel();
                var oFI = oMeta.getODataFunctionImport(this.oConfig.path);
                if (oFI) {
                  // TODO
                }
              }

              if (oParams.busyControl) {
                oParams.busyControl.setBusy(true);
              }
              this.oModel.callFunction(this.oConfig.path, {
                method: this.oConfig.method,
                urlParameters: oParams.params,
                success: function(oData, oResponse) {
                  if (oParams.busyControl) {
                    // reset busy indication
                    oParams.busyControl.setBusy(false);
                  }
                  resolve({
                    params: oParams,
                    data: oData,
                    response: oResponse
                  });
                },
                error: function(oError) {
                  // reset busy indication
                  if (oParams.busyControl) {
                    oParams.busyControl.setBusy(false);
                  }
                  reject(oError);
                }
              });
            }.bind(this),
            reject
          );
        }.bind(this)
      );
    }
  });
});
