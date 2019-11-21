sap.ui.define(
  [
    'sap/ui/base/EventProvider',
    'sap/ui/generic/app/transaction/TransactionController',
    'sap/ui/model/Context',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/bundle',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataResponseHandler',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/transaction/TransactionNoDraft',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/odata/ODataMetaModelExt',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(EventProvider, TransactionController, Context, bundle, ODataResponseHandler, Transaction, ODataMetaModelExt, Assert) {
    'use strict';

    return EventProvider.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.transaction.TransactionDraft', {
      constructor: function(params) {
        // read params
        this._oComponent = params.component;
        this._oModel = params.model;

        // create generic API
        this._oTransactionController = new TransactionController(this._oModel);
        this._oDraftController = this._oTransactionController.getDraftController();

        // create utils
        this._oODataMetaModelExt = new ODataMetaModelExt(params.component);

        // create non-draft transaction object
        this._oTransactionNonDraft = new Transaction({
          component: params.component,
          model: params.model
        });

        // invalidation
        this.aInvalidatedCallbacks = [];

        // init app model
        this._oAppModel = this._oComponent.getModel('app');
        Assert.ok(this._oAppModel, 'cannot init transaction. no app model');
        this._oAppModel.setData(
          {
            draft: {
              state: 'clear'
            }
          },
          true // merge
        );

        // auto save
        this._oWhenDraftSaved = null;
        this._bEnableAutoSave = true;
        this._oModel.attachPropertyChange(this._onModelPropertyChange.bind(this));
      },

      //~~~ auto save ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      /*
       * listen to property changes of the model
       * and fire saving at the end of current java script "thread"
       */
      _onModelPropertyChange: function() {
        setTimeout(
          function() {
            if (this._bEnableAutoSave) {
              this.whenDraftSaved();
            }
          }.bind(this),
          0
        );
      },

      setEnableAutoSave: function(bEnabled) {
        this._bEnableAutoSave = bEnabled;
      },

      whenPropertiesSet: function(params) {
        // TODO check params
        for (var i = 0; i < params.paths.length; i++) {
          this._oModel.setProperty(params.paths[i], params.values[i]);
        }
        return this.whenDraftSaved();
      },

      _setSaving: function(params, bValue) {
        // busy control
        this._setBusy(params, bValue);

        // app model
        var sState = bValue ? 'saving' : 'saved';
        this._oAppModel.setProperty('/draft/state', sState);
      },

      _setBusy: function(params, bValue) {
        if (params && params.busyControl) {
          params.busyControl.setBusyIndicatorDelay(0);
          params.busyControl.setBusy(bValue);
        }
      },

      //~~~ invalidate ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      attachDraftInvalidated: function(fnFunction, oFunctionThis) {
        this.aInvalidatedCallbacks.push(fnFunction.bind(oFunctionThis));
      },

      _fireDraftInvalidated: function(oContext) {
        for (var i = 0; i < this.aInvalidatedCallbacks.length; i++) {
          this.aInvalidatedCallbacks[i](oContext);
        }
      },

      //~~~ whens ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

      whenFunctionImportCalled: function(params) {
        return this._oTransactionNonDraft.whenFunctionImportCalled(params);
      },

      whenRead: function(params) {
        return this._oTransactionNonDraft.whenRead(params);
      },

      whenUpdated: function(params) {
        return this._oTransactionNonDraft.whenUpdated(params);
      },

      whenDeleted: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenDeleted. no params');
        Assert.ok(params.contexts, 'cannot execute transaction whenDeleted. no contexts');

        // get contexts to delete
        //  - for draft entities we have to compute the active context !!!
        // get contexts to invalidate (drafts only)

        var aDeleteContexts = [];
        var aInvalidationContexts = [];
        for (var i = 0; i < params.contexts.length; i++) {
          var oContext = params.contexts[i];
          var oObject = oContext.getObject();
          if (oObject.IsActiveEntity) {
            aDeleteContexts.push(oContext);
          } else {
            // determine entity set
            var sPath = oContext.getPath();
            var iFrom = sPath.indexOf('/');
            var iTo = sPath.indexOf('(');
            var sEntitySet = sPath.substr(iFrom + 1, iTo - 1);

            // determine active context
            var oActiveObject = {};
            oActiveObject.IsActiveEntity = true;
            oActiveObject.HasActiveEntity = false;
            var sGuid = this._oODataMetaModelExt.getGuid(sEntitySet);
            oActiveObject[sGuid] = oObject.ActiveUUID;
            var sPath = '/' + this._oModel.createKey(sEntitySet, oActiveObject);
            var oActiveContext = new Context(this._oModel, sPath);

            // push contexts
            aDeleteContexts.push(oActiveContext);
            aInvalidationContexts.push(oContext);
          }
        }

        // fire delete
        return new Promise(
          function(resolve, reject) {
            var oWhenDeleted = this._oTransactionNonDraft.whenDeleted({ busyControl: params.busyControl, contexts: aDeleteContexts });
            oWhenDeleted.then(
              function() {
                // fire invalidation for deleted drafts
                for (var i = 0; i < aInvalidationContexts.length; i++) {
                  var oContext = aInvalidationContexts[i];
                  this._fireDraftInvalidated(oContext);
                }
                // resolve
                resolve();
              }.bind(this),
              reject
            );
          }.bind(this)
        );
      },

      /**
       * Promise for saving changes to draft
       * Will create only 1 promise for N events. Why?
       *  - the SmartField fires 2 events for Selects < 1.46!
       *  - the user enters data faster than the system can save
       * @returns {Promise}
       */
      whenDraftSaved: function(params) {
        // avoid duplicate saving processes
        if (this._oWhenDraftSaved) {
          return this._oWhenDraftSaved;
        }

        //removing old messages from messgae model
        sap.ui
          .getCore()
          .getMessageManager()
          .removeAllMessages();

        this._oWhenDraftSaved = new Promise(
          function(resolve, reject) {
            // resolve right away if no changes
            if (!this._oModel.hasPendingChanges()) {
              resolve();
              return;
            }

            this._setSaving(params, true);

            new ODataResponseHandler({
              model: this._oModel,
              success: function() {
                this._setSaving(params, false);
                // TODO: reset after timeout (TBD)
                // TODO: put messages to the message popover
                resolve();
              }.bind(this),
              error: reject
            });

            // call submitChanges() afterwards
            this._oModel.submitChanges();
          }.bind(this)
        );

        // reset the promise variable after execution
        var fnReset = function() {
          this._oWhenDraftSaved = null;
        }.bind(this);
        this._oWhenDraftSaved.then(fnReset, fnReset);

        // done
        return this._oWhenDraftSaved;
      },

      /**
       * Promise for creating a new draft
       * @returns {Promise}
       */
      whenDraftNewCreated: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenDraftNewCreated. no oParams');
        Assert.ok(params.path, 'cannot execute transaction whenDraftNewCreated. no path');

        // default params
        if (!params.properties) {
          params.properties = {};
        }

        return new Promise(
          function(resolve, reject) {
            // reset busy after metadata has been loaded
            this._oModel.metadataLoaded().then(
              function() {
                var oWhenDraftSaved = this.whenDraftSaved();
                oWhenDraftSaved.then(
                  function() {
                    this._setBusy(params, true);

                    var oContext = this._oModel.createEntry(params.path, {
                      properties: params.properties,

                      success: function(oData, oResponse) {
                        this._setBusy(params, false);
                        resolve({
                          params: params,
                          context: oContext,
                          data: oData
                        });
                      }.bind(this),

                      error: function(oError) {
                        this._setBusy(params, false);
                        try {
                          this._oModel.deleteCreatedEntry(oContext);
                        } catch (e) {
                          jQuery.sap.log.error('failed to delete created entry for context: ' + oContext);
                        }
                        reject(oError);
                      }.bind(this)
                    });
                  }.bind(this)
                );
              }.bind(this),
              reject
            );
          }.bind(this)
        );
      },

      /**
       * Promise for activating a draft
       * Does NOT call the preparation action as BOPF will do this on demand on the server on activation
       * @returns {Promise}
       */
      whenDraftActivated: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenDraftActivated. no oParams');
        Assert.ok(params.context, 'cannot execute transaction whenDraftActivated. no context');

        // check object
        var oObject = params.context.getObject();
        Assert.ok(!oObject.IsActiveEntity, 'Cannot execute transaction whenDraftActivated for an activate object.');

        return new Promise(
          function(resolve, reject) {
            this._setBusy(params, true);
            // this handler is called when any of the promises in our chain gets rejected
            var fnReject = function() {
              this._setBusy(params, false);
              reject();
            }.bind(this);

            // function for activation
            var fnActivate = function() {
              var oWhenDraftSaved = this.whenDraftSaved();
              oWhenDraftSaved.then(
                function() {
                  var oWhenActivated = this._oDraftController.activateDraftEntity(params.context);
                  oWhenActivated.then(
                    function(oResult) {
                      this._setBusy(params, false);
                      resolve({
                        params: params,
                        data: oResult.data,
                        context: oResult.context
                      });

                      this._fireDraftInvalidated(params.context);
                      // this._oModel.refresh(true,true); // TODO
                      this._oModel.invalidate();
                    }.bind(this),
                    fnReject
                  );
                }.bind(this),
                fnReject
              );
            }.bind(this);

            // if a save is running we wait with the activation
            if (this._oWhenDraftSaved) {
              this._oWhenDraftSaved.then(fnActivate, fnActivate);
            } else {
              fnActivate();
            }
          }.bind(this)
        );
      },

      whenDraftEditCreated: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenDraftEditCreated. no oParams');
        Assert.ok(params.context, 'cannot execute transaction whenDraftEditCreated. no context');

        // check object
        var oObject = params.context.getObject();
        Assert.ok(oObject.HasDraftEntity || oObject.IsActiveEntity, 'Cannot execute transaction whenDraftEditCreated for a create draft.');

        return new Promise(
          function(resolve, reject) {
            this._setSaving(params, true);
            var oWhen = this._oDraftController.createEditDraftEntity(params.context);
            oWhen.then(
              // resolve
              function(oResult, oError) {
                this._setSaving(params, false);
                if (oResult) {
                  resolve({
                    params: params,
                    context: params.context,
                    data: oResult.data
                  });
                } else {
                  reject(oError);
                }
              }.bind(this),
              // rejcet
              function() {
                this._setSaving(params, false);
                reject();
              }.bind(this)
            );
          }.bind(this)
        );
      },

      /**
       * Promise to delete an object
       * @returns {Promise}
       */
      whenDraftDeleted: function(params) {
        // check params
        Assert.ok(params, 'cannot execute transaction whenDraftDeleted. no params');
        Assert.ok(params.context, 'cannot execute transaction whenDraftDeleted. no context');

        // check object
        var oObject = params.context.getObject();
        Assert.ok(!oObject.IsActiveEntity, 'Cannot execute transaction whenDraftDeleted for an active entity.');

        return new Promise(
          function(resolve, reject) {
            this._setBusy(params, true);

            // function for deletion
            var fnDelete = function() {
              var oWhenDraftSaved = this.whenDraftSaved({});
              oWhenDraftSaved.then(
                function() {
                  var oWhenDeleted = this._oTransactionNonDraft.whenDeleted({ contexts: [params.context] });
                  oWhenDeleted.then(
                    // resolve
                    function(oResult) {
                      this._setBusy(params, false);
                      // fire deletion events
                      this._fireDraftInvalidated(params.context);
                      this._oModel.invalidate();
                      // resolve
                      resolve();
                    }.bind(this),

                    // reject
                    function() {
                      this._setBusy(params, params, false);
                      reject();
                    }.bind(this)
                  );
                }.bind(this),
                reject
              );
            }.bind(this);

            // if a save is running we wait with the deletion
            if (this._oWhenDraftSaved) {
              this._oWhenDraftSaved.then(fnDelete, fnDelete);
            } else {
              fnDelete();
            }
          }.bind(this)
        );
      }
    });
  }
);
