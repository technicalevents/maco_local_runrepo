sap.ui.define(['sap/ui/model/json/JSONModel'], function(JSONModel) {
  'use strict';

  /**
   * Right now the sole purpose of this object is to serve as a marker.
   * The ErrorManager needs to differ between:
   * - sap.ui.model.message.MessageModel
   * - com.sap.cd.maco.mmt.ui.reuse.message.MessageModel
   */
  return JSONModel.extend('com.sap.cd.maco.mmt.ui.reuse.message.MessageModel', {
    constructor: function() {
      JSONModel.call(this, {});
      this.setDefaultBindingMode('OneWay');
    },

    updateMessages: function(aMessages) {
      this.setData(aMessages);
    },

    isCustomMessageModel: true
  });
});
