'use strict';

const path = require('path');
const shell = require('shelljs');

var aGithubMapping = [{
  actualGit: "mmt-ui-app-dispprocess-b",
  localGit: "displaymessage",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "mmt-ui-app-dispmsg-b",
  localGit: "displaymessage",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "mmt-ui-app-overviewprocess-b",
  localGit: "overviewprocess",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "mmt-ui-app-invoicedocument-b",
  localGit: "invoicedocument",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "mmt-ui-app-massmetereading-b",
  localGit: "massmetereading",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "mmt-ui-app-processuiaction-b",
  localGit: "displayprocessuiaction",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "mmt-ui-app-displaymarketpartners-b",
  localGit: "displaymarketpartners",
  isReuseLib: false,
  resourceFolder: "webapp"
}, {
  actualGit: "mmt-ui-lib-b",
  localGit: "mmt-ui-lib",
  isReuseLib: true,
  resourceFolder: "src/com/sap/cd/maco/mmt/ui/reuse"
}];



 function triggerSyncOperation (grunt, oGithubMapping, sOperation) {
  grunt.log.writeln(sOperation);
  // Return unique array of all file paths which match globbing pattern
  var sSrcPath = getSrcPath(oGithubMapping, sOperation);
  var sDestinationPath = getDestinatiationPath(oGithubMapping, sOperation);

  var options = { cwd: sDestinationPath };
  var globPattern = "**/*"

  grunt.file.expand(options, globPattern).forEach(function (srcPathRelCwd) {
    if (srcPathRelCwd.indexOf("test") < 0 && srcPathRelCwd.indexOf("localService") < 0 && srcPathRelCwd.indexOf(".") > 0) {
      // Copy a source file to a destination path, creating directories if necessary
      grunt.file.copy(
        path.join(sDestinationPath, srcPathRelCwd),
        path.join(sSrcPath, srcPathRelCwd)
      );
    }
  });

  shell.exec("git add .");

  grunt.log.writeln(sDestinationPath);
};

function getSrcPath (oGithubMapping, sOperation) {
  var sActualPath = "../" + oGithubMapping.actualGit + "/" + oGithubMapping.resourceFolder + "/";
  var sLocalPath = oGithubMapping.localGit + "/" + oGithubMapping.resourceFolder;

  return sOperation === "syncActual" ? sLocalPath : sActualPath;
};

function getDestinatiationPath (oGithubMapping, sOperation) {
  var sActualPath = "../" + oGithubMapping.actualGit + "/" + oGithubMapping.resourceFolder + "/";
  var sLocalPath = oGithubMapping.localGit + "/" + oGithubMapping.resourceFolder;

  return sOperation === "syncActual" ? sActualPath : sLocalPath;
};
module.exports = function (grunt) {

  grunt.registerTask('syncactual', 'Sync Actual Github', function (sModuleName) {

    if (sModuleName) {
      grunt.log.writeln(sModuleName);

      var oGithubMapping = aGithubMapping.find(function (oGithubMapping) {
        return oGithubMapping.localGit === sModuleName;
      }.bind(this));

      var sDestinationPath = "../" + oGithubMapping.actualGit + "/" + oGithubMapping.resourceFolder + "/";
      var sSrcPath = oGithubMapping.localGit + "/" + oGithubMapping.resourceFolder;

      // Return unique array of all file paths which match globbing pattern
      var options = { cwd: sSrcPath };
      var globPattern = "**/*"

      grunt.file.expand(options, globPattern).forEach(function (srcPathRelCwd) {
        if (srcPathRelCwd.indexOf("test") < 0 && srcPathRelCwd.indexOf("localService") < 0 && srcPathRelCwd.indexOf(".") > 0) {
          grunt.log.writeln(path.join(sSrcPath, srcPathRelCwd));
          // Copy a source file to a destination path, creating directories if necessary
          grunt.file.copy(
            path.join(sSrcPath, srcPathRelCwd),
            path.join(sDestinationPath, srcPathRelCwd)
          );
        }
      });

      grunt.log.writeln(sDestinationPath);
    }

  });

  grunt.registerTask('synclocal', 'Sync Local Github', function (sModuleName, sMessage) {

    if (sModuleName) {
      grunt.log.writeln(sModuleName);

      var oGithubMapping = aGithubMapping.find(function (oGithubMapping) {
        return oGithubMapping.localGit === sModuleName;
      }.bind(this));

      triggerSyncOperation(grunt, oGithubMapping, "syncLocal");

    } else {
      aGithubMapping.find(function (oGithubMapping) {
        triggerSyncOperation(grunt, oGithubMapping, "syncLocal");
      }.bind(this));
    }

    shell.exec("git commit -m " + sMessage);
    shell.exec("git push origin");

  }.bind(this));

}.bind(this);
