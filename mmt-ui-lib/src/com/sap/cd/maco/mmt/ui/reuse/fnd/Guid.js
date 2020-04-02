/* eslint no-console: "off"  */
sap.ui.define([], function() {
  'use strict';

  return {
    /**
     * Converts record id into guid format
     * @public
     * @param {String} sId id to be converted into GUID format
     * @returns {String} id into GUID format
     */
    convertIdToGuid: function(sId) {
      return sId.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5').toLowerCase();
    },

    /**
     * Check whether id is in guid format or not
     * @public
     * @param   {String}   sId     id to be checked
     * @returns {String}           whether id is in guid format or not
     */
    isGuid: function(sId) {
      var sRegex = /[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}/i;
      var oMatch = sRegex.exec(sId);
      return oMatch != null;
    },

    /**
     * Generates a random GUID. This is a trivial implementation. TODO Some day search the internet for something better.
     * @public
     * @returns {String} guid
     */
    generateGuid: function() {
      function r() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return r() + r() + '-' + r() + '-' + r() + '-' + r() + '-' + r() + r() + r();
    }
  };
});
