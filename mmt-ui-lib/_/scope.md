# Scope

## *

Msg handling
•	Transient = dialog (1..N)
•	Non-transient = message dialog (1..N)
•	Auch error messages können beide enthalten!!!??!!!

Activation
•	FE does 1 call on both create and edit draft
•	No prep calls

* preserveChanges
    * DraftContext.prototype.hasPreserveChanges = function(oContext) {
    * Checks if the parameter "PreserveChanges" is supported by the edit function.
         * If the edit action is triggered with the parameter set to <code>true</code> the
         * ABAP application infrastructure will respond with HTTP response code 409 if unsaved 
         * changes (from another user) exist. 
     * manifest: refreshAfterChanges???

* check model settings of FE in manifest (only change...)

* mass change
    * https://sapui5.hana.ondemand.com/#/sample/sap.ui.comp.sample.smartmultiedit/preview

* state, custom state
https://help.sap.com/viewer/DRAFT/96880755e4e64fcd96c12694f430fece/Internal/en-US/89fa878945294931b15a581a99043005.html

* "ForEdit" some mechanism to edit key fields
    * only draft
    * only key fields
    * both create/edit
    * issue 22.02.19: not considered by FE in navigation so far

## External Navigation

* Inbound
  * Open Object
    * If the parameters provided are specific enough to define an instance, the app navigates directly to the object page.
  * Set Filter
    * Otherwise, the list report is shown with filters set according to the provided parameters.
  * Preferred Mode
    * display, edit, create
  * Open Sub Object
  * Conversion of startup parameters of type Edm.Guid
    * https://wiki.wdf.sap.corp/wiki/display/fioritech/Configuring+Navigation
* External
  * FE: send all properties of e.g. a list entry

## List Report

* share action / variant share flag                 (?) :yellow_heart:
* app state                                         (?) :heart:
* global variant management                         (app) :green_heart:
* filter bar
    * search                                        (app) :green_heart:
    * live mode                                     (app) :green_heart:
    * editing status filter                         (reuse) :yellow_heart:
        * test var mgt
        * XML Composite?
        * also a fragment for config?
        * hide from group, filter
    * save custom filter in variant                 (app) :green_heart:
    * Filtered By Text                              (?) :yellow_heart:
* table
    * object identifier                             (reuse) :green_heart:
        * proper visuals
        * "unnamed object" text
    * requestAtLeastFields / select                 (app) :green_heart:
    * expand                                        (app) :green_heart:
    * sticky header                                 (app) :green_heart:
    * count                                         (app) :green_heart:
    * growing                                       (app) :green_heart:
    * draft
        * exand/filter/select draft metadata        (reuse) :green_heart:
        * highlight column for create drafts        (reuse) :green_heart:
        * show draft status as link (and details)   (reuse) :green_heart:
    * create action                                 (?) :yellow_heart:
        * create button tooltip
    * delete action                                 (reuse) :yellow_heart:
        * fragment OR control?
        * unify texts in reuse
        * must use Draft.js (popups)
    * other actions                                 (app) :yellow_heart:
    * disabling buttons                             (reuse) :heart:
    * select mode                                   (?) :yellow_heart:
    * excel                                         (?) :yellow_heart:
    * view settings                                 (?) :yellow_heart:
        * exclude filter        
    * sort order default                            (?) :yellow_heart:
    * grid table                                    (?) :yellow_heart:

## Object Page
* header
    * page variants
        * FE planned 1905
    * breadcrumbs
    * show draft status as button (and details)     (reuse) :yellow_heart:
    * navigate to active version (and back)         (reuse) :yellow_heart:
    * header facets                                 (reuse) :yellow_heart:
        * with proper layout              
        * with annotations (criti, ...)        
        * with status CSS
    * Disable buttons                               (reuse) :yellow_heart:
        * use "ac" ?
    * toggle draft/non-draft
        * FE planned 1905, some already in List report
* sections  
    * header facet in edit mode                     (app) :yellow_heart:

## Actions
* edit                                              (app) :green_heart:
    * check for unsaved changes                     
        * [Guidline](https://ux.wdf.sap.corp/fiori-design-web/draft-handling/#-an-item-with-unsaved-changes-by-another-user1)
        * not in FE => skipped
    * check for locking draft                       
        * [Guideline](https://ux.wdf.sap.corp/fiori-design-web/draft-handling/#-a-locked-item1)
        * FE only 409 message of server => same
* delete                                            (app) :yellow_heart:
    * check for locking draft
        * no checks on client
    * check for unsaved changes
        * no checks on client
* cancel (draft)                                    (app) :yellow_heart:
    * user confirmation via popover ... FE no more????
* save (draft)
    * confirm warning messages, FE planned 1905, RAP dependency


## Sub Object Page
* edit button on sub level                          (app) :yellow_heart: