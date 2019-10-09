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

    execute: function(oParams) {
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
		  this._oParams = oParams;
			this._fnResolve = resolve;
			this._fnReject = reject;
          this.oModel.metadataLoaded().then(
            this._execute.bind(this),
            reject
          );
        }.bind(this)
      );
    },

      _execute: function() {
		  if (Array.isArray(this._oParams.contexts) && this._oParams.contexts.length > 0) {
			  var oContext = this._oParams.contexts[0];
			  var oObject = oContext.getObject();
			  var oMeta = this.oModel.getMetaModel();
			  var oFI = oMeta.getODataFunctionImport(this.oConfig.path);
			  if (oFI) {
				  // TODO
			  }
		  }

		  if (this._oParams.busyControl) {
			  this._oParams.busyControl.setBusy(true);
		  }

		  this.oModel.callFunction(this.oConfig.path, {
			      method: this.oConfig.method,
			  urlParameters: this._oParams.params,
			  success: this._success.bind(this),
			  error: this._error.bind(this)
		  });
	  },

	  _success: function(oData, oResponse) {
		  // reset busy indication
		  if (this._oParams.busyControl) {
			  this._oParams.busyControl.setBusy(false);
		  }

		  // show message
		  var aObjects = [];
		  for (var i = 0; i < this._oParams.contexts.length; i++) {
			  var oContext = this._oParams.contexts[i];
			  aObjects.push(oContext.getObject());
		  }
		  var sMsg =
			  this._oParams.contexts.length === 1
				  ? this.getConfigText('successMsg1', 'transactionCallFunctionImportSuccess', aObjects)
				  : this.getConfigText('successMsgN', 'transactionCallFunctionImportSuccess', aObjects);
		  this.oMessage.success({
			  msg: sMsg
		  });

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
	  }
  });
});
