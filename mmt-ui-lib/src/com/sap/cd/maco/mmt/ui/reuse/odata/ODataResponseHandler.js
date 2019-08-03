sap.ui.define(['sap/ui/base/Object'], function(Object) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.odata.ODataResponseHandler', {
    _aMatchingHttpMethods: ['POST', 'PUT', 'MERGE', 'DELETE'],

    constructor: function(params) {
      Object.apply(this);

      // check params
      if (!params) {
        throw new Error('Failed to instantiate. params missing');
      }
      if (!params.model) {
        throw new Error('Failed to instantiate. model missing');
      }
      if (!params.success && !params.error) {
        throw new Error('Failed to instantiate. success and error missing');
      }
      if (!params.matchEvent) {
        // ok, optional
      }

      this._oModel = params.model;
      this._fnSuccess = params.success;
      this._fnError = params.error;
      this._fnMatchEvent = params.matchEvent;
      this._iSuccessCount = 0;
      this._iExpectedSuccessCount = 0;

      this._attachHandler();
    },

    /**
     * Checks if the event is relevant
     * @param oEvent
     * @returns {boolean}
     * @private
     */
    _matchEvent: function(oEvent) {
      if (this._fnMatchEvent) {
        // use custom matcher
        return this._fnMatchEvent(oEvent);
      } else {
        // use default matching
        var sMethod = oEvent.getParameter('method');
        var iIndex = this._aMatchingHttpMethods.indexOf(sMethod);
        return iIndex !== -1;
      }
    },

    /**
     *
     * @param oEvent
     * @private
     */
    _onRequestSent: function(oEvent) {
      if (!this._matchEvent(oEvent)) {
        return;
      }
      this._iExpectedSuccessCount++;
    },

    /**
     *
     * @param oEvent
     * @private
     */
    _onRequestCompleted: function(oEvent) {
      if (!this._matchEvent(oEvent)) {
        return;
      }

      // forward non-success to the failed handler
      var bSuccess = oEvent.getParameter('success');
      if (!bSuccess) {
        this._onRequestFailed(oEvent);
        return;
      }

      this._iSuccessCount++;

      if (this._iSuccessCount === this._iExpectedSuccessCount) {
        if (this._fnSuccess) {
          this._fnSuccess();
        }
        this._detachHandler();
      }
    },

    /**
     *
     * @param oEvent
     * @private
     */
    _onRequestFailed: function(oEvent) {
      if (!this._matchEvent(oEvent)) {
        return;
      }

      if (this._fnError) {
        var response = oEvent.getParameter('response');
        this._fnError(response);
      }
      this._detachHandler();
    },

    /**
     *
     * @private
     */
    _attachHandler: function() {
      this._oModel.attachEvent('requestSent', this._onRequestSent, this);
      this._oModel.attachEvent('requestCompleted', this._onRequestCompleted, this);
      this._oModel.attachEvent('requestFailed', this._onRequestFailed, this);
    },

    /**
     *
     * @private
     */
    _detachHandler: function() {
      this._oModel.detachEvent('requestSent', this._onRequestSent, this);
      this._oModel.detachEvent('requestCompleted', this._onRequestCompleted, this);
      this._oModel.detachEvent('requestFailed', this._onRequestFailed, this);
    }
  });
});
