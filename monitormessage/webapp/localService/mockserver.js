sap.ui.define(['sap/ui/core/util/MockServer'], function(MockServer) {
  'use strict';

  return {
    init: function() {
      var oMockServer,
        _sAppModulePath = 'com/sap/cd/maco/monitor/ui/app/overviewmessages/',
        _sJsonFilesModulePath = _sAppModulePath + 'localService/mockdata';

      var oUriParameters = jQuery.sap.getUriParameters(),
        sJsonFilesUrl = jQuery.sap.getModulePath(_sJsonFilesModulePath),
        sManifestUrl = jQuery.sap.getModulePath(_sAppModulePath + 'manifest', '.json'),
        oManifest = jQuery.sap.syncGetJSON(sManifestUrl).data,
        oDataSource = oManifest['sap.app'].dataSources,
        oMainDataSource = oDataSource.Main,
        sMetadataUrl = jQuery.sap.getModulePath(
          _sAppModulePath + oMainDataSource.settings.localUri.replace('.xml', ''),
          '.xml'
        ),
        // ensure there is a trailing slash
        sMockServerUrl = /.*\/$/.test(oMainDataSource.uri)
          ? oMainDataSource.uri
          : oMainDataSource.uri + '/',
        aAnnotations = oMainDataSource.settings.annotations;

      oMockServer = new MockServer({
        rootUri: sMockServerUrl
      });

      // configure mock server with a delay of 1s
      MockServer.config({
        autoRespond: true,
        autoRespondAfter: oUriParameters.get('serverDelay') || 0
      });

      // load local mock data
      oMockServer.simulate(sMetadataUrl, {
        sMockdataBaseUrl: sJsonFilesUrl,
        bGenerateMissingMockData: true
      });

      oMockServer.start();

      if (aAnnotations && aAnnotations.length > 0) {
        aAnnotations.forEach(function(sAnnotationName) {
          var oAnnotation = oDataSource[sAnnotationName],
            sUri = oAnnotation.uri,
            sLocalUri = jQuery.sap.getModulePath(
              _sAppModulePath + oAnnotation.settings.localUri.replace('.xml', ''),
              '.xml'
            );

          ///annotiaons
          new MockServer({
            rootUri: sUri,
            requests: [
              {
                method: 'GET',
                path: new RegExp(''),
                response: function(oXhr) {
                  jQuery.sap.require('jquery.sap.xml');

                  var oAnnotations = jQuery.sap.sjax({
                    url: sLocalUri,
                    dataType: 'xml'
                  }).data;

                  oXhr.respondXML(200, {}, jQuery.sap.serializeXML(oAnnotations));
                  return true;
                }
              }
            ]
          }).start();
        });
      }
    }
  };
});
