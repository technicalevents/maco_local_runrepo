sap.ui.define(['sap/ui/base/Object'], function(Object) {
  'use strict';

  /**
   * !!! deprecated !!!
   */
  return Object.extend('com.sap.cd.maco.mmt.ui.reuse.fnd.base.Actions', {
    destroy: function() {
      for (var sProperty in this) {
        if (this.hasOwnProperty(sProperty)) {
          if (this[sProperty].destroy) {
            this[sProperty].destroy();
          }
        }
      }
    }
  });
});
