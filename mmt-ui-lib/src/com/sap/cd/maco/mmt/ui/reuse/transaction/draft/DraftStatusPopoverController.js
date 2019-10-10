sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/base/BaseFragmentController', 'sap/ui/model/json/JSONModel', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle'],
  function(BaseFragmentController, JSONModel, bundle) {
    'use strict';

    return BaseFragmentController.extend('com.sap.cd.maco.mmt.ui.reuse.transaction.draft.DraftStatus', {
      constructor: function(oComponent) {
        BaseFragmentController.call(this, {
          id: 'draftStatusPopover',
          fragmentName: 'com.sap.cd.maco.mmt.ui.reuse.transaction.draft.DraftStatusPopover',
          component: oComponent
        });
      },

      onInit: function() {
        BaseFragmentController.prototype.onInit.apply(this, arguments);

        var oFragmentModel = new JSONModel({
          title: '',
          text1: '',
          text2: '',
          date2: ''
        });
        this.getFragment().setModel(oFragmentModel, 'draftPopover');
      },

      close: function() {
        this.getFragment().close();
      },

      open: function(oByControl, oContext) {
        var sPath = oContext.getPath() + '/DraftAdministrativeData';
        var oObject = oContext.getObject();
        var oAdmin = this.oModel.getProperty(sPath);

        // set model
        var oModel = this.getFragment().getModel('draftPopover');
        var oBundle = bundle.get();
        if (oObject.HasDraftEntity && !oAdmin.InProcessByUser) {
          // unsaved by other user
          oModel.setProperty('/title', oBundle.getText('draftPopoverUnsavedChanges'));
          oModel.setProperty('/text1', oBundle.getText('draftPopoverUnsavedTitle', oAdmin.LastChangedByUser));
          oModel.setProperty('/text2', oBundle.getText('draftPopoverLastChanges'));
          oModel.setProperty('/date2', oAdmin.LastChangeDateTime);
        } else if (oObject.HasDraftEntity && oAdmin.InProcessByUser) {
          // locked by other user
          oModel.setProperty('/title', oBundle.getText('draftPopoverLocked'));
          oModel.setProperty('/text1', oBundle.getText('draftPopoverLockTitle', oAdmin.LastChangedByUser));
          oModel.setProperty('/text2', oBundle.getText('draftPopoverLastChanges'));
          oModel.setProperty('/date2', oAdmin.LastChangeDateTime);
        } else if (!oObject.IsActiveEntit) {
          // draft by user
          oModel.setProperty('/title', oBundle.getText('draftPopoverDraft'));
          oModel.setProperty('/text1', '');
          oModel.setProperty('/text2', oBundle.getText('draftPopoverLastChanges'));
          oModel.setProperty('/date2', oAdmin.LastChangeDateTime);
        } else {
          throw Error('unhandled state');
        }

        // open
        this.getFragment().openBy(oByControl);
      }
    });
  }
);
