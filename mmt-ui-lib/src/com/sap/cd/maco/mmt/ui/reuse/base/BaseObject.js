/*global location*/
sap.ui.define(['sap/ui/base/Object', 'com/sap/cd/maco/mmt/ui/reuse/base/_/copy'], function(Object, copy) {
  'use strict';

  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.base.BaseObject', {
    constructor: function(oComponent) {
      copy(oComponent, this);
    }
  });
});
