sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/base/BaseViewController', 'sap/ui/model/json/JSONModel', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle'],
  function(BaseViewController, JSONModel, bundle) {
    'use strict';

    return BaseViewController.extend('com.sap.cd.maco.mmt.ui.reuse._.ActionController', {
      onInit: function(oConfig) {
        BaseViewController.prototype.onInit.apply(this, arguments);

        // check config
        this.oAssert.ok(oConfig, 'ActionController cannot init. no config set');
        if (!oConfig.actions) {
          oConfig.actions = {};
        }
        this.oConfig = oConfig;

        // check controls
        /*
        for (var sId in oConfig.actions) {
          var oAction = this.byId(sId);
          this.oAssert.ok(oAction, 'ActionController cannot init. no control in view for action id: ' + sId);
        }
        */

        // set initial show actions
        this._bShowActions = oConfig.hasOwnProperty('showActions') ? !!oConfig.showActions : true;

        // set this model
        var oThisModel = new JSONModel({});
        oThisModel.setDefaultBindingMode('OneWay');
        this.getView().setModel(oThisModel, 'this');

        // init actions
        this._updateActions();
      },

      _getActionBusyControl: function() {
        throw new Error('not implemented');
      },

      _getActionContexts: function() {
        throw new Error('not implemented');
      },

      setShowActions: function(bValue) {
        this._bShowActions = bValue;
        this._updateActions();
      },

      _getControlId: function(oControl) {
        var sId = oControl.getId();
        var aIdSplit = sId.split('--');
        if (aIdSplit.length === 0) {
          throw new Error('failed to get suffix for id: ' + oControl);
        }
        return aIdSplit[aIdSplit.length - 1];
      },

      onExecuteAction: function(oEvent) {
        // in place action?
        var oSource = oEvent.getSource();
        var sControlId = this._getControlId(oSource);
        var sActionId = sControlId;
        var bInplace = sControlId.indexOf('-_') !== -1;
        if (bInplace) {
          sActionId = sControlId.substring(0, sControlId.indexOf('-_'));
        }

        // get action
        var oAction = this.oConfig.actions[sActionId];
        this.oAssert.ok(oAction, 'ActionController cannot execute action ' + sActionId + '. no config for this action');

        // get context
        var aContexts;
        if (bInplace) {
          var oControl = this.byId(sControlId);
          var oContext = oControl.getBindingContext();
          aContexts = [oContext];
        } else {
          aContexts = this._getActionContexts();
        }

        // add standard params
        var oParams = {
          busyControl: this._getActionBusyControl(),
          contexts: aContexts,
          event: oEvent,
          controller: this
        };

        // execute before
        var sBeforeName = 'onBeforeExecute_' + sActionId;
        if (this[sBeforeName]) {
          this[sBeforeName](oParams, oEvent);
        }

        // execute
        oAction.execute(oParams).then(
          // resolve
          function(oResult) {
            // execute after
            var sAfterName = 'onAfterExecute_' + sActionId;
            if (this[sAfterName]) {
              this[sAfterName](oResult, oParams);
            }
          }.bind(this),
          // reject
          function() {}
        );
      },

      onBeforeExecuteAction: function(sId, oParams) {
        // to be overriden by subclassers
      },

      onAfterExecuteAction: function(sId, oResult, oParams) {
        // to be overriden by subclassers
      },

      /**
       * why does this not fail for inplace actions?
       * because the template is still available via byId
       */
      _updateActions: function() {
        // iterate actions
        for (var sId in this.oConfig.actions) {
          // get action
          var oAction = this.oConfig.actions[sId];
          this.oAssert.ok(oAction, 'ActionController failed to set actions. empty action for id ' + sId);
          this.oAssert.function(oAction.enabled, 'ActionController failed to set actions enabled. no enabled function for action ' + sId);

          // let action compute the value
          var aContexts = this._getActionContexts();
          var bEnabled = oAction.enabled(aContexts);

          // get control
          var oControl = this.byId(sId);
          if (!oControl) {
            continue;
          }

          // enable control
          var bInplace = !!oControl.data('actionInplace');
          if (!bInplace && oControl.setEnabled) {
            oControl.setEnabled(bEnabled);
          }
        }
      }
    });
  }
);
