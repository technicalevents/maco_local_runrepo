# maco-monitor-ui-ap

Manage Customer Emails

## Manual Deployment

Install below tools:

- [MTA Builder Download](http://nexus.wdf.sap.corp:8081/nexus/content/repositories/deploy.releases.xmake/com/sap/mta/mta_archive_builder/)

- [MultiApps CF CLI Plugin](https://github.com/cloudfoundry-incubator/multiapps-cli-plugin)

Deployment steps:

- Build Portal with MTA

  Windows

  `java -jar C:\Users\I075737\mta_archive_builder-1.1.0.jar --build-target=CF --mtar=com-sap-cd-maco-mmt-ui-app-mgrcustemails.mtar build`

  MacOS

  `java -jar /Users/i074174/mta_archive_builder-1.1.0.jar --build-target=CF --mtar=com-sap-cd-maco-mmt-ui-app-mgrcustemails.mtar build`

- Portal Deployment

  ```shell
  cf deploy com-sap-cd-maco-mmt-ui-app-mgrcustemails.mtar -e mta_dev.mtaext
  cf deploy com-sap-cd-maco-mmt-ui-app-mgrcustemails.mtar -e mta_test.mtaext
  ```
