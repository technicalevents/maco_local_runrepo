/*global location*/
sap.ui.define(
  ['com/sap/cd/maco/mmt/ui/reuse/base/BaseAction', 'com/sap/cd/maco/mmt/ui/reuse/_/bundle', 'com/sap/cd/maco/mmt/ui/reuse/base/UI5MetadataTool'],
  function(BaseAction, bundle, UI5MetadataTool) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.share.SaveAsTileAction', {
      constructor: function(oComponent, oConfig) {
        BaseAction.call(this, oComponent, oConfig, '0');
        this._oUI5MetadataTool = new UI5MetadataTool();
      },

      execute: function(oParams) {
        return new Promise(
          function(resolve, reject) {
            // get bookmark
            var oBookmark;
            if (this._oUI5MetadataTool.isSubclass(oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.listReport.ListReportController')) {
              oBookmark = this._getBookmarkListReport(oParams.controller);
            } else if (this._oUI5MetadataTool.isSubclass(oParams.controller, 'com.sap.cd.maco.mmt.ui.reuse.objectPage.ObjectPageController')) {
              oBookmark = this._getBookmarkObjectPage(oParams);
            } else {
              this.oAssert.ok(false, 'unhandled controller class (must be list report or object page): ' + oParams.controller);
              reject();
            }

            // call bookmark service
            var oBookmarkService = sap.ushell.Container.getService('Bookmark');
            oBookmarkService
              .addBookmark(oBookmark)
              .done(
                function() {
                  var sMsg = bundle.get().getText('shareSaveAsTileSuccess');
                  this.oMessage.success({ msg: sMsg });
                  resolve();
                }.bind(this)
              )
              .fail(function(sMessage) {
                var sMsg = bundle.get().getText('shareSaveAsTileError') + '. ' + sMessage;
                this.oMessage.error({ msg: sMsg });
                reject();
              });
          }.bind(this)
        );
      },

      _getBookmarkListReport: function(oParams) {
        return {
          url: document.location.hash,
          title: this.getConfigText('appTitleMsgKey', '?'),
          serviceUrl: this._getServiceUrl(oParams.controller)
        };
      },

      _getBookmarkObjectPage: function(oParams) {
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

        return {
          url: document.location.hash,
          title: oObject[this.oConfig.objectTextProperty],
          subtitle: oObject[this.oConfig.objectIdProperty]
        };
      },

      /**
       * the way this logic works it will be empty if the search has not been triggered yet ...
       * ... but it behaves the same way in a Fiori Element 1.60
       */
      _getServiceUrl: function(oParams) {
        var oTable = oParams.controller.getSmartTable().getTable();
        var oBinding = oTable.getBinding('rows') || oTable.getBinding('items');
        if (!oBinding) {
          this.oAssert(false, 'no binding for table: ' + oTable);
        }
        var sResult = (oBinding && oBinding.getDownloadUrl()) || '';
        if (sResult) {
          sResult += '&$top=0&$inlinecount=allpages';
        }
        return sResult;
      }
    });
  }
);