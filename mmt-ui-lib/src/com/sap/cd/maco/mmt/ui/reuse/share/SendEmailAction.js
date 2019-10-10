/*global location*/
sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/base/BaseAction', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle', 'com/sap/cd/maco/mmt/ui/reuse/base/UI5MetadataTool'],
  function(BaseAction, bundle, UI5MetadataTool) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.share.SendEmailAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '0');
        this._oUI5MetadataTool = new UI5MetadataTool();
      },

      execute: function(oParams) {
        return new Promise(
          function(resolve, reject) {
            // get target text
            var sTargetText;
            if (this._oUI5MetadataTool.isSubclass(oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.listReport.ListReportController')) {
              sTargetText = this.getConfigText('appTitleMsgKey', '?');
            } else if (this._oUI5MetadataTool.isSubclass(oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageController')) {
              // check
              this.assertContextParam(oParams);
              var oObject = oParams.contexts[0].getObject();
              this.oAssert.ok(
                oObject.hasOwnProperty(this.oConfig.objectTextProperty),
                'cannot save as tile. the object has no text property: ' + this.oConfig.objectTextProperty
              );
              this.oAssert.ok(
                oObject.hasOwnProperty(this.oConfig.objectIdProperty),
                'cannot save as tile. the object has no id property: ' + this.oConfig.objectIdProperty
              );

              sTargetText = oObject[this.oConfig.objectTextProperty] + ' - ' + oObject[this.oConfig.objectIdProperty];
            } else {
              this.oAssert.ok(false, 'unhandled controller class (must be list report or object page): ' + oParams.controller);
              reject();
            }

            // open email
            var sSubject = bundle.get().getText('shareSendEmailSubject', [sTargetText]);
            var sBody = window.location.href;
            sap.m.URLHelper.triggerEmail(null, sSubject, sBody, null, null);
          }.bind(this)
        );
      }
    });
  }
);
