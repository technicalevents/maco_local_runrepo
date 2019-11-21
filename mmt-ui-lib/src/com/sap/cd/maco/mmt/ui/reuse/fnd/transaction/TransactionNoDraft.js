sap.ui.define(
  [
    'sap/ui/base/EventProvider',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataResponseHandler',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(EventProvider, ODataResponseHandler, bundle, Assert) {
    'use strict';

    return EventProvider.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.transaction.TransactionNoDraft', {
      constructor: function(params) {
        this._component = params.component;
        this._model = params.model;
      },

      _setBusy: function(params, bValue) {
        if (params && params.busyControl) {
          params.busyControl.setBusyIndicatorDelay(0);
          params.busyControl.setBusy(bValue);
        }
      },

      /**
       *
       * @param params
       * @returns {Promise}
       */
      whenSubmitted: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenDeleted. no params');

        return new Promise(
          function(resolve, reject) {
            // changes?
            if (!this._model.hasPendingChanges()) {
              resolve();
              return;
            }

            this._setBusy(params, true);

            // create request handler first
            new ODataResponseHandler({
              model: this._model,
              success: function() {
                // reset busy indication
                this._setBusy(params, false);
                resolve({
                  params: params
                });
              }.bind(this),
              error: function(response) {
                this._setBusy(params, false);
                reject(response);
              }.bind(this)
            });

            // call submitChanges() afterwards
            this._model.submitChanges();
          }.bind(this)
        );
      },

      /**
       *
       * @returns {Promise}
       */
      whenDeleted: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenDeleted. no params');
        Assert.ok(params.paths || params.contexts, 'cannot execute transaction whenDeleted. paths or contexts required');
        if (params.paths) {
          Assert.array(params.paths, 'cannot execute transaction whenDeleted. paths must be an array');
        }
        if (params.contexts) {
          Assert.array(params.contexts, 'cannot execute transaction whenDeleted. contexts must be an array');
        }

        // fill paths by the contexts
        // (but only if paths not set)
        if (!params.paths && params.contexts) {
          params.paths = [];
          for (var i = 0; i < params.contexts.length; i++) {
            params.paths.push(params.contexts[i].getPath());
          }
        }

        return new Promise(
          function(resolve, reject) {
            this._setBusy(params, true);

            // create request handler first
            new ODataResponseHandler({
              model: this._model,

              success: function() {
                this._setBusy(params, false);
                resolve({
                  params: params
                });
              }.bind(this),

              error: function(response) {
                this._component.oErrorManager.addTechnicalMessage('remove failed for paths: ' + params.paths);
                this._setBusy(params, false);
                reject();
              }.bind(this)
            });

            // loop paths and call remove
            // the model will put all of them into a single batch
            for (var i = 0; i < params.paths.length; i++) {
              var path = params.paths[i];
              this._model.remove(path);
            }
          }.bind(this)
        );
      },

      /**
       *
       * @param params
       * @returns {Promise}
       */
      whenCreated: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenCreated. no params');
        Assert.ok(params.path, 'cannot execute transaction whenCreated. no path set');
        Assert.ok(params.data, 'cannot execute transaction whenCreated. no data set');

        return new Promise(
          function(resolve, reject) {
            this._model.metadataLoaded().then(
              function() {
                this._setBusy(params, true);
                this._model.create(params.path, params.data, {
                  success: function(oData, oResponse) {
                    this._setBusy(params, false);
                    resolve({
                      params: params,
                      data: oData,
                      response: oResponse
                    });
                  }.bind(this),

                  error: function(oError) {
                    this._setBusy(params, false);
                    reject(oError);
                  }.bind(this)
                });
              }.bind(this),
              reject
            );
          }.bind(this)
        );
      },

      /**
       *
       * @param params
       * @returns {Promise}
       */
      whenUpdated: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenUpdated. no params');
        Assert.ok(params.path, 'cannot execute transaction whenUpdated. no path set');
        Assert.ok(params.data, 'cannot execute transaction whenUpdated. no data set');

        return new Promise(
          function(resolve, reject) {
            // reset busy after metadata has been loaded
            this._model.metadataLoaded().then(
              function() {
                this._setBusy(params, true);

                this._model.update(params.path, params.data, {
                  success: function(oData, oResponse) {
                    this._setBusy(params, false);
                    resolve({
                      params: params,
                      data: oData,
                      response: oResponse
                    });
                  }.bind(this),

                  error: function(oError) {
                    this._setBusy(params, false);
                    reject(oError);
                  }.bind(this)
                });
              }.bind(this),
              reject
            );
          }.bind(this)
        );
      },

      /**
       *
       * @param params
       * @returns {Promise}
       */
      whenRead: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenRead. no params');
        Assert.ok(params.path, 'cannot execute transaction whenRead. no path set');

        return new Promise(
          function(resolve, reject) {
            // reset busy after metadata has been loaded
            this._model.metadataLoaded().then(
              function() {
                this._setBusy(params, true);

                this._model.read(params.path, {
                  urlParameters: params.urlParameters,

                  filters: params.filters,

                  sorters: params.sorters,

                  success: function(oData, oResponse) {
                    this._setBusy(params, false);
                    resolve({
                      params: params,
                      data: oData,
                      response: oResponse
                    });
                  }.bind(this),

                  error: function(oError) {
                    this._setBusy(params, false);
                    reject(oError);
                  }.bind(this)
                });
              }.bind(this),
              reject
            );
          }.bind(this)
        );
      },

      /**
       *
       * @param{object} params - params object for function import
       * @returns {Promise} - return promise after calling function import
       */
      whenFunctionImportCalled: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenFunctionImportCalled. no params');
        Assert.ok(params.path, 'cannot execute transaction whenFunctionImportCalled. no path set');
        Assert.ok(params.method, 'cannot execute transaction whenFunctionImportCalled. no method set');

        return new Promise(
          function(resolve, reject) {
            this._model.metadataLoaded().then(
              function() {
                this._setBusy(params, true);

                this._model.callFunction(params.path, {
                  method: params.method,
                  urlParameters: params.urlParameters,
                  success: function(oData, oResponse) {
                    this._setBusy(params, false);
                    resolve({
                      params: params,
                      data: oData,
                      response: oResponse
                    });
                  }.bind(this),
                  error: function(oError) {
                    // reset busy indication
                    this._setBusy(params, false);
                    reject(oError);
                  }.bind(this)
                });
              }.bind(this),
              reject
            );
          }.bind(this)
        );
      }
    });
  }
);
