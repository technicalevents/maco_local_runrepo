/*global location*/
sap.ui.define(['com/sap/cd/maco/mmt/ui/reuse/base/BaseFragmentController'], function(BaseFragmentController) {
  'use strict';

  return BaseFragmentController.extend('com.sap.cd.maco.mmt.ui.reuse.message.ConfirmPopoverController', {
    constructor: function(params) {
      BaseFragmentController.call(this, {
        id: 'confirm',
        fragmentName: 'com.sap.cd.maco.mmt.ui.reuse.message.ConfirmPopover',
        component: params.component,
        view: params.view
      });
    },

    open: function(params) {
      // check params
      if (!params) {
        throw new Error('Failed to open confirm popover. params missing');
      }
      if (!params.byControl) {
        throw new Error('Failed to open confirm popover. byControl missing');
      }
      if (!params.messageText) {
        throw new Error('Failed to open confirm popover. messageText missing');
      }
      if (!params.buttonText) {
        throw new Error('Failed to open confirm popover. buttonText missing');
      }

      this.byId('label').setText(params.messageText);
      this.byId('button').setText(params.buttonText);

      this.getFragment().openBy(params.byControl);

      this._bConfirmed = false;

      return new Promise(
        function(resolve, reject) {
          this._fnResolve = resolve;
          this._fnReject = reject;
        }.bind(this)
      );
    },

    _onConfirm: function() {
      this._bConfirmed = true;
      this.getFragment().close();
    },

    _onAfterClose: function() {
      if (this._bConfirmed) {
        this._fnResolve();
      } else {
        this._fnReject();
      }
    }
  });
});
