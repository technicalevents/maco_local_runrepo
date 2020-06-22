'use strict';

const path = require('path');
const shell = require('shelljs');

var sLocalGitHubName = "maco_local_runrepo";

var aGithubMapping = [{
  actualGit: "displayprocesses",
  localGit: "displayprocess",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "displaymessages",
  localGit: "displaymessage",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "overviewprocesses",
  localGit: "overviewprocess",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "invoicedocument",
  localGit: "invoicedocument",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "massmeterreadings",
  localGit: "massmeterreading",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "processuiactions",
  localGit: "displayprocessuiaction",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "displaymarketpartners",
  localGit: "displaymarketpartners",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "definecontactrules",
  localGit: "definecontactrules",
  isReuseLib: false,
  resourceFolder: "webapp"
},{
  actualGit: "mmt-ui-app-overviewoperation-b",
  localGit: "overviewoperation",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "reuse",
  localGit: "mmt-ui-lib",
  isReuseLib: true,
  resourceFolder: "src/com/sap/cd/maco/mmt/ui/reuse"
}, {
  actualGit: "usernotifications",
  localGit: "usernotifications",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "maintmsgcontacts",
  localGit: "maintainmessagecontact",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "overviewmessages",
  localGit: "overviewmessage",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "changeRequestInbox",
  localGit: "changeRequestInbox",
  isReuseLib: false,
  resourceFolder: "webapp"
}];

var sGitUrl = "https://github.wdf.sap.corp/MaCo-UIMP4G/";



function triggerSyncOperation(grunt, oGithubMapping, sOperation) {
  grunt.log.writeln(sOperation);
  // Return unique array of all file paths which match globbing pattern
  var sSrcPath = getSrcPath(oGithubMapping, sOperation);
  var sDestinationPath = getDestinatiationPath(oGithubMapping, sOperation);

  grunt.log.writeln(oGithubMapping);
  var sGitFolder = sOperation === "syncActual" ? "../" + oGithubMapping.actualGit : oGithubMapping.localGit;

  

  grunt.log.writeln(sGitFolder + "=" + grunt.file.exists(sGitFolder));

  var options = { cwd: sSrcPath };
  var globPattern = "**/*"

  grunt.file.expand(options, globPattern).forEach(function (srcPathRelCwd) {
    if (srcPathRelCwd.indexOf("test") < 0 && srcPathRelCwd.indexOf("localService") < 0 && srcPathRelCwd.indexOf(".") > 0) {
      // Copy a source file to a destination path, creating directories if necessary
      grunt.file.copy(
        path.join(sSrcPath, srcPathRelCwd),
        path.join(sDestinationPath, srcPathRelCwd)
      );
    }
  });

  shell.exec("git add .");

  grunt.log.writeln(sDestinationPath);
  grunt.log.writeln(sSrcPath);
};

function getSrcPath(oGithubMapping, sOperation) {
  var sActualPath = "../" + oGithubMapping.actualGit + "/" + oGithubMapping.resourceFolder + "/";
  var sLocalPath = oGithubMapping.localGit + "/" + oGithubMapping.resourceFolder;

  return sOperation === "syncActual" ? sLocalPath : sActualPath;
};

function getDestinatiationPath(oGithubMapping, sOperation) {
  var sActualPath = "../" + oGithubMapping.actualGit + "/" + oGithubMapping.resourceFolder + "/";
  var sLocalPath = oGithubMapping.localGit ? oGithubMapping.localGit + "/" + oGithubMapping.resourceFolder : oGithubMapping.resourceFolder;

  return sOperation === "syncActual" ? sActualPath : sLocalPath;
};
module.exports = function (grunt) {

  grunt.registerTask('syncactual', 'Sync Actual Github', function (sModuleName) {

    // First pull the latest code
    shell.exec("git pull origin");

    if (sModuleName) {
      grunt.log.writeln(sModuleName);

      var oGithubMapping = aGithubMapping.find(function (oGithubMapping) {
        return oGithubMapping.localGit === sModuleName;
      }.bind(this));

      triggerSyncOperation(grunt, oGithubMapping, "syncActual");

    } else {
      aGithubMapping.forEach(function (oGithubMapping) {
        triggerSyncOperation(grunt, oGithubMapping, "syncActual");
      }.bind(this));
    }

  });

  grunt.registerTask('synclocal', 'Sync Local Github', function (sModuleName, sMessage) {
    // If no commit message passed throw error and exit
    // if (!sMessage) {
    //   grunt.fail.fatal("Commit Message not provided");
    // }

    grunt.log.writeln("ModuleName:" + sModuleName);

    // First pull the latest code
    shell.exec("git pull origin");

    if (sModuleName) {
      grunt.log.writeln(sModuleName);

      var oGithubMapping = aGithubMapping.find(function (oGithubMapping) {
        return oGithubMapping.localGit === sModuleName;
      }.bind(this));

      triggerSyncOperation(grunt, oGithubMapping, "syncLocal");

    } else {
      aGithubMapping.forEach(function (oGithubMapping) {
        triggerSyncOperation(grunt, oGithubMapping, "syncLocal");
      }.bind(this));
    }

    // shell.exec("git commit -m '" + sMessage + "'");
    // shell.exec("git push origin");

  }.bind(this));

  grunt.registerTask('cloneall', 'Clone All Github Repos', function () {
   var sFullGitUrl;
   var sGitCloneCommand;
   var sCommand;
   
    // First pull the latest code
    // shell.exec("cd /Users/i310549/MMT-app/UIMP4G/");
    // shell.exec("ls");

    aGithubMapping.forEach(function(oGitHubmapping){
      sFullGitUrl = sGitUrl + oGitHubmapping.actualGit + ".git";
      sGitCloneCommand = "git clone " + sFullGitUrl;
      sCommand = "cd /Users/i310549/MMT-app/UIMP4G/; " + sGitCloneCommand;
      shell.exec(sCommand);
    });

    // shell.exec("git commit -m '" + sMessage + "'");
    // shell.exec("git push origin");

  }.bind(this));

}.bind(this);
