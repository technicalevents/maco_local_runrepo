sap.ui.define(
  [
    'jquery.sap.global',
    'sap/ui/base/Object',
    'sap/ui/generic/app/navigation/service/NavigationHandler',
    'sap/ui/core/routing/History',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(jQuery, Object, NavigationHandler, History, Assert) {
    'use strict';

    return Object.extend('com.sap.cd.maco.mmt.ui.reuse.objects.nav.Navigation', {
      constructor: function(oComponent) {
        this._oComponent = oComponent;
        this._oNavHandler = new NavigationHandler(oComponent);
        this._oHistory = History.getInstance();
        this._oCrossAppNavigator = sap.ushell.Container.getService('CrossApplicationNavigation');
      },

      navNotFound: function(params) {
        // check params
        Assert.ok(params, 'cannot show notFound page. params missing');
        Assert.ok(params.msg || params.msgKey, 'cannot show notFound page. msg or msgKey must be set');
        // optional: msgParams

        // check targets
        var oTargets = this._oComponent.getRouter().getTargets();
        if (!oTargets.getTarget('notFound')) {
          Assert.ok(false, 'cannot show notFound page. The notFound target is missing in your route configuration');
        }

        // get message
        var sMessage;
        if (params.msg) {
          sMessage = params.msg;
        } else {
          sMessage = this._oComponent.oBundle.getText(params.msgKey, params.msgParams);
        }

        // trigger navigation
        oTargets.display('notFound', {
          message: sMessage
        });
      },

      /**
       * why have we wrapped the NavigationHandler for external navigation?
       *  - error handling
       *  - ability to switch sap.ui.generic and sap.ushell
       *  - dependency to sap.ui.generic only in reuse-lib
       *  - better API (object vs N params)
       */
      navExternal: function(params) {
        // check params
        if (!params) {
          throw new Error('missing params');
        }
        if (!params.semanticObject) {
          throw new Error('missing param: semanticObject');
        }
        if (!params.action) {
          throw new Error('missing param: action');
        }
        if (!params.params) {
          // ok, optional
        }
        if (!params.appState) {
          // ok, optional
        }

        var fnError = function() {
          this.message.technicalError({
            msg: 'Failed to navigate to external app ' + params.semanticObject + '-' + params.action
          });
        }.bind(this);

        // call nav handler
        this._oNavHandler.navigate(params.semanticObject, params.action, params.params, params.appState, fnError);
      },

      /**
       * Function parse navigation and returns promise object
       * @public
       * @returns {jQuery.Deferred.Promise()} Promise Object
       */
      parseNavigation: function() {
        return this._oNavHandler.parseNavigation();
      },

      /**
       * Function store current app state and returns promise object
       * @param {Object} oCurrentAppState Current application state
       * @public
       * @returns {jQuery.Deferred.Promise()} Promise Object
       */
      storeInnerAppState: function(oCurrentAppState) {
        return this._oNavHandler.storeInnerAppState(oCurrentAppState);
      },

      /**
       *
       */
      navHistoryBackShellHome: function() {
        var sPreviousUI5Hash = this._oHistory.getPreviousHash();
        var bThereIsAnFLPHash = !this._oCrossAppNavigator.isInitialNavigation();
        if (sPreviousUI5Hash || bThereIsAnFLPHash) {
          history.go(-1);
        } else {
          this._oCrossAppNavigator.toExternal({
            target: {
              shellHash: '#Shell-home'
            }
          });
        }
      },

      /**
       *
       * @param route
       * @param params
       */
      navHistoryBackAppTarget: function(route, params) {
        var sPreviousHash = this._oHistory.getPreviousHash();
        var bThereIsAnFLPHash = !this._oCrossAppNavigator.isInitialNavigation();
        if (sPreviousHash || bThereIsAnFLPHash) {
          history.go(-1);
        } else {
          this._oComponent.getRouter().navTo(route, params, true);
        }
      },

      /**
       * Navigates back if history is not empty
       * Navigates forward if the history is empty to
       *  - the specified target
       *  - or the FLP home page if not target is specified
       * @param sSemanticObject
       * @param sAction
       * @param oParams
       */
      navHistoryBackExternalTarget: function(sSemanticObject, sAction, oParams) {
        var sPreviousHash = this._oHistory.getPreviousHash();
        var bThereIsAnFLPHash = !this._oCrossAppNavigator.isInitialNavigation();
        if (sPreviousHash || bThereIsAnFLPHash) {
          history.go(-1);
        } else if (sSemanticObject && sAction && oParams) {
          this._oCrossAppNavigator.toExternal({
            target: {
              semanticObject: sSemanticObject,
              action: sAction
            },
            params: oParams
          });
        } else {
          this._oCrossAppNavigator.toExternal({
            target: {
              shellHash: '#Shell-home'
            }
          });
        }
      }
    });
  }
);
