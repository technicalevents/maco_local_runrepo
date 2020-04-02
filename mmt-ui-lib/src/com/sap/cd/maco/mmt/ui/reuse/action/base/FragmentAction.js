/*global location*/
sap.ui.define(
  [
    'com/sap/cd/maco/mmt/ui/reuse/action/base/BaseAction',
    'sap/ui/core/Fragment',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/ContentDensity',
    'com/sap/cd/maco/mmt/ui/reuse/fnd/Assert'
  ],
  function(BaseAction, Fragment, ContentDensity, Assert) {
    'use strict';

    return BaseAction.extend('com.sap.cd.maco.mmt.ui.reuse.action.base.FragmentAction', {
      _sFragmentId: undefined,
      _oFragment: undefined,

      constructor: function(oComponent, oConfig, sCardinality, sFragmentId, sFragmentName) {
        // super
        BaseAction.call(this, oComponent, oConfig, sCardinality);

        // check params
        Assert.ok(sFragmentId, 'Cannot instantiate FragmentAction. id missing');
        Assert.ok(sFragmentName, 'Cannot instantiate FragmentAction. fragmentName missing');

        // keep
        this._sFragmentName = sFragmentName;

        // create id
        this._sFragmentId = this.oComponent.createId(sFragmentId);
      },

      getFragment: function() {
        if (!this._oFragment) {
          // create
          this._oFragment = sap.ui.xmlfragment(this._sFragmentId, this._sFragmentName, this);

          // retrieve the "root" view of the component
          var oRootView;
          if (this.oComponent.getRootControl) {
            oRootView = this.oComponent.getRootControl(); // UI5 => 1.44
          } else {
            oRootView = this.oComponent.getAggregation('rootControl'); // UI5 < 1.42 (not really a public contract)
          }

          // add fragment to root view
          oRootView.addDependent(this._oFragment);

          // add content density CSS class
          var sContentDensity = ContentDensity.get();
          if (sContentDensity) {
            this._oFragment.addStyleClass(sContentDensity);
          }
        }

        return this._oFragment;
      },

      /**
       *
       * @returns {undefined|*}
       */
      getFragmentId: function() {
        return this._sFragmentId;
      },

      /**
       * Destroys the objects and releases all object references.
       */
      destroy: function() {
        // destroy stuff
        if (this._oFragment) {
          this._oFragment.removeEventDelegate(this, this);
          this._oFragment.destroy();
        }

        // Reset properties
        this._oFragment = null;

        // call overwritten destroy
        BaseAction.prototype.destroy.apply(this, arguments);
      },

      /**
       * Utility function for accessing an element inside the fragment by its id.
       * @param {string} sId the id of the element inside the fragment.
       * @returns {sap.ui.core.Element} the element matching the id.
       */
      byId: function(sId) {
        return Fragment.byId(this._sFragmentId, sId);
      },

      /**
       * Utility function for creating an id for an element inside the fragment.
       * @param {string} sId the id of the element inside the fragment.
       * @returns {string} the id.
       */
      createId: function(sId) {
        return Fragment.createId(this._sFragmentId, sId);
      }
    });
  }
);
