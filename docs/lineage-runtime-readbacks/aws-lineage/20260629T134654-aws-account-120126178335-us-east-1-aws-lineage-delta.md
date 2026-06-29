# Source Metadata Delta Readback

Generated: 2026-06-29T13:46:54.573Z

Connector: `aws-account-120126178335-us-east-1`

Source family: `aws`

Source scope: `aws-account:120126178335:us-east-1`

Mode: `full_refresh`

Full refresh reason: MDP production AWS full ingestion and publication requested 2026-06-29

Baseline: `C:/projects/Sonic-data-lineage/registry/object-registry.jsonl`

## Counts

| Status         | Count |
| -------------- | ----: |
| new            |   111 |
| changed        |     0 |
| unchanged      |     0 |
| retained_stale |     0 |
| removed_stale  |     0 |

## Non-Unchanged Objects

| Status | Canonical ID                                                                                           | Type                   | Database | Schema     | Object                                                          |
| ------ | ------------------------------------------------------------------------------------------------------ | ---------------------- | -------- | ---------- | --------------------------------------------------------------- |
| new    | aws://120126178335/us-east-1/account/120126178335                                                      | aws_account            |          |            | Northwest Motorsport - Production                               |
| new    | aws://120126178335/us-east-1/athena/catalog/AwsDataCatalog                                             | athena_data_catalog    |          | catalogs   | AwsDataCatalog                                                  |
| new    | aws://120126178335/us-east-1/athena/service                                                            | aws_athena_service     |          | athena     | athena                                                          |
| new    | aws://120126178335/us-east-1/athena/workgroup/primary                                                  | athena_workgroup       |          | workgroups | primary                                                         |
| new    | aws://120126178335/us-east-1/glue/service                                                              | aws_glue_service       |          | glue       | glue                                                            |
| new    | aws://120126178335/us-east-1/quicksight/service                                                        | aws_quicksight_service |          | quicksight | quicksight                                                      |
| new    | aws://120126178335/us-east-1/s3/bucket/ami.nwmsrocks.com                                               | s3_bucket              |          |            | ami.nwmsrocks.com                                               |
| new    | aws://120126178335/us-east-1/s3/bucket/aws-glue-assets-120126178335-us-west-2                          | s3_bucket              |          |            | aws-glue-assets-120126178335-us-west-2                          |
| new    | aws://120126178335/us-east-1/s3/bucket/beanstalkstatus-producti-serverlessdeploymentbuck-omyc7kvf25dl  | s3_bucket              |          |            | beanstalkstatus-producti-serverlessdeploymentbuck-omyc7kvf25dl  |
| new    | aws://120126178335/us-east-1/s3/bucket/blog.nwmsrocks.com                                              | s3_bucket              |          |            | blog.nwmsrocks.com                                              |
| new    | aws://120126178335/us-east-1/s3/bucket/build-inventory-before.nwmsrocks.com                            | s3_bucket              |          |            | build-inventory-before.nwmsrocks.com                            |
| new    | aws://120126178335/us-east-1/s3/bucket/build-inventory.nwmsrocks.com                                   | s3_bucket              |          |            | build-inventory.nwmsrocks.com                                   |
| new    | aws://120126178335/us-east-1/s3/bucket/build-make-logo.nwmsrocks.com                                   | s3_bucket              |          |            | build-make-logo.nwmsrocks.com                                   |
| new    | aws://120126178335/us-east-1/s3/bucket/build.nwmsrocks.com                                             | s3_bucket              |          |            | build.nwmsrocks.com                                             |
| new    | aws://120126178335/us-east-1/s3/bucket/cards.nwmsrocks.com                                             | s3_bucket              |          |            | cards.nwmsrocks.com                                             |
| new    | aws://120126178335/us-east-1/s3/bucket/cdktoolkit-stagingbucket-unzxepgb5um0                           | s3_bucket              |          |            | cdktoolkit-stagingbucket-unzxepgb5um0                           |
| new    | aws://120126178335/us-east-1/s3/bucket/cdn.nwmsrocks.com                                               | s3_bucket              |          |            | cdn.nwmsrocks.com                                               |
| new    | aws://120126178335/us-east-1/s3/bucket/cf-templates-179dunutbirk8-us-west-2                            | s3_bucket              |          |            | cf-templates-179dunutbirk8-us-west-2                            |
| new    | aws://120126178335/us-east-1/s3/bucket/closestlocation-producti-serverlessdeploymentbuck-b67bics3y15z  | s3_bucket              |          |            | closestlocation-producti-serverlessdeploymentbuck-b67bics3y15z  |
| new    | aws://120126178335/us-east-1/s3/bucket/codepipeline-us-west-2-153216105098                             | s3_bucket              |          |            | codepipeline-us-west-2-153216105098                             |
| new    | aws://120126178335/us-east-1/s3/bucket/craigslistextensiondynam-serverlessdeploymentbuck-1sp1ms8h6y9r6 | s3_bucket              |          |            | craigslistextensiondynam-serverlessdeploymentbuck-1sp1ms8h6y9r6 |
| new    | aws://120126178335/us-east-1/s3/bucket/cropped-inventory.nwmsrocks.com                                 | s3_bucket              |          |            | cropped-inventory.nwmsrocks.com                                 |
| new    | aws://120126178335/us-east-1/s3/bucket/cross-sell-production-serverlessdeploymentbucket-9msqoslvzg0l   | s3_bucket              |          |            | cross-sell-production-serverlessdeploymentbucket-9msqoslvzg0l   |
| new    | aws://120126178335/us-east-1/s3/bucket/cross-sell.nwmsrocks.com                                        | s3_bucket              |          |            | cross-sell.nwmsrocks.com                                        |
| new    | aws://120126178335/us-east-1/s3/bucket/dealer-socket-import-pro-serverlessdeploymentbuck-1rouzzwu7f6qo | s3_bucket              |          |            | dealer-socket-import-pro-serverlessdeploymentbuck-1rouzzwu7f6qo |
| new    | aws://120126178335/us-east-1/s3/bucket/dealersocket-import                                             | s3_bucket              |          |            | dealersocket-import                                             |
| new    | aws://120126178335/us-east-1/s3/bucket/dealersocket-unzip                                              | s3_bucket              |          |            | dealersocket-unzip                                              |
| new    | aws://120126178335/us-east-1/s3/bucket/developer.nwmsrocks.com                                         | s3_bucket              |          |            | developer.nwmsrocks.com                                         |
| new    | aws://120126178335/us-east-1/s3/bucket/documents.nwmsrocks.com                                         | s3_bucket              |          |            | documents.nwmsrocks.com                                         |
| new    | aws://120126178335/us-east-1/s3/bucket/elasticbeanstalk-us-east-1-120126178335                         | s3_bucket              |          |            | elasticbeanstalk-us-east-1-120126178335                         |
| new    | aws://120126178335/us-east-1/s3/bucket/elasticbeanstalk-us-west-2-120126178335                         | s3_bucket              |          |            | elasticbeanstalk-us-west-2-120126178335                         |
| new    | aws://120126178335/us-east-1/s3/bucket/feed-image-overlay-produ-serverlessdeploymentbuck-17rq77a0yew41 | s3_bucket              |          |            | feed-image-overlay-produ-serverlessdeploymentbuck-17rq77a0yew41 |
| new    | aws://120126178335/us-east-1/s3/bucket/file-cache.internal.northwestmotorsportinc.com                  | s3_bucket              |          |            | file-cache.internal.northwestmotorsportinc.com                  |
| new    | aws://120126178335/us-east-1/s3/bucket/hipchat.internal.northwestmotorsportinc.com                     | s3_bucket              |          |            | hipchat.internal.northwestmotorsportinc.com                     |
| new    | aws://120126178335/us-east-1/s3/bucket/imagerecognition-product-serverlessdeploymentbuck-te5ih5pl95za  | s3_bucket              |          |            | imagerecognition-product-serverlessdeploymentbuck-te5ih5pl95za  |
| new    | aws://120126178335/us-east-1/s3/bucket/inventory-image-resize-p-serverlessdeploymentbuck-18bomb5qwf4mt | s3_bucket              |          |            | inventory-image-resize-p-serverlessdeploymentbuck-18bomb5qwf4mt |
| new    | aws://120126178335/us-east-1/s3/bucket/inventory.nwmsrocks.com                                         | s3_bucket              |          |            | inventory.nwmsrocks.com                                         |
| new    | aws://120126178335/us-east-1/s3/bucket/inventoryautocomplete-pr-serverlessdeploymentbuck-wlmz33azth7x  | s3_bucket              |          |            | inventoryautocomplete-pr-serverlessdeploymentbuck-wlmz33azth7x  |
| new    | aws://120126178335/us-east-1/s3/bucket/inventorylambdafeed-prod-serverlessdeploymentbuck-lpn2m13fov0v  | s3_bucket              |          |            | inventorylambdafeed-prod-serverlessdeploymentbuck-lpn2m13fov0v  |
| new    | aws://120126178335/us-east-1/s3/bucket/local-inventory.nwmsrocks.com                                   | s3_bucket              |          |            | local-inventory.nwmsrocks.com                                   |
| new    | aws://120126178335/us-east-1/s3/bucket/localinventoryimages-pro-serverlessdeploymentbuck-1qkqbiqp745uw | s3_bucket              |          |            | localinventoryimages-pro-serverlessdeploymentbuck-1qkqbiqp745uw |
| new    | aws://120126178335/us-east-1/s3/bucket/makelogoresize-productio-serverlessdeploymentbuck-d4r8kp4gkvle  | s3_bucket              |          |            | makelogoresize-productio-serverlessdeploymentbuck-d4r8kp4gkvle  |
| new    | aws://120126178335/us-east-1/s3/bucket/monroney.nwmsrocks.com                                          | s3_bucket              |          |            | monroney.nwmsrocks.com                                          |
| new    | aws://120126178335/us-east-1/s3/bucket/nwmotorsport.com                                                | s3_bucket              |          |            | nwmotorsport.com                                                |
| new    | aws://120126178335/us-east-1/s3/bucket/nwmotorsports.com                                               | s3_bucket              |          |            | nwmotorsports.com                                               |
| new    | aws://120126178335/us-east-1/s3/bucket/nwms-image-recognition                                          | s3_bucket              |          |            | nwms-image-recognition                                          |
| new    | aws://120126178335/us-east-1/s3/bucket/nwms-lambda-pywebhook                                           | s3_bucket              |          |            | nwms-lambda-pywebhook                                           |
| new    | aws://120126178335/us-east-1/s3/bucket/nwms-ms                                                         | s3_bucket              |          |            | nwms-ms                                                         |
| new    | aws://120126178335/us-east-1/s3/bucket/nwms-screenshots                                                | s3_bucket              |          |            | nwms-screenshots                                                |
| new    | aws://120126178335/us-east-1/s3/bucket/nwms-test                                                       | s3_bucket              |          |            | nwms-test                                                       |
| new    | aws://120126178335/us-east-1/s3/bucket/nwms-widget                                                     | s3_bucket              |          |            | nwms-widget                                                     |
| new    | aws://120126178335/us-east-1/s3/bucket/nwmsgophish                                                     | s3_bucket              |          |            | nwmsgophish                                                     |
| new    | aws://120126178335/us-east-1/s3/bucket/nwmsgophish-logs                                                | s3_bucket              |          |            | nwmsgophish-logs                                                |
| new    | aws://120126178335/us-east-1/s3/bucket/nwmsrocks-alb-access-logs                                       | s3_bucket              |          |            | nwmsrocks-alb-access-logs                                       |
| new    | aws://120126178335/us-east-1/s3/bucket/nwmsrocks.com                                                   | s3_bucket              |          |            | nwmsrocks.com                                                   |
| new    | aws://120126178335/us-east-1/s3/bucket/olaf-ang                                                        | s3_bucket              |          |            | olaf-ang                                                        |
| new    | aws://120126178335/us-east-1/s3/bucket/photo-booth.nwmsrocks.com                                       | s3_bucket              |          |            | photo-booth.nwmsrocks.com                                       |
| new    | aws://120126178335/us-east-1/s3/bucket/photo-upload.nwmsrocks.com                                      | s3_bucket              |          |            | photo-upload.nwmsrocks.com                                      |
| new    | aws://120126178335/us-east-1/s3/bucket/private.nwmsrocks.com                                           | s3_bucket              |          |            | private.nwmsrocks.com                                           |
| new    | aws://120126178335/us-east-1/s3/bucket/processed.nwmsrocks.com                                         | s3_bucket              |          |            | processed.nwmsrocks.com                                         |
| new    | aws://120126178335/us-east-1/s3/bucket/processinventory-product-serverlessdeploymentbuck-uk4r1r3tmhy0  | s3_bucket              |          |            | processinventory-product-serverlessdeploymentbuck-uk4r1r3tmhy0  |
| new    | aws://120126178335/us-east-1/s3/bucket/pw.nwmsrocks.com                                                | s3_bucket              |          |            | pw.nwmsrocks.com                                                |
| new    | aws://120126178335/us-east-1/s3/bucket/related.nwmsrocks.com                                           | s3_bucket              |          |            | related.nwmsrocks.com                                           |
| new    | aws://120126178335/us-east-1/s3/bucket/reporting-nwms                                                  | s3_bucket              |          |            | reporting-nwms                                                  |
| new    | aws://120126178335/us-east-1/s3/bucket/reports.nwmotorsport.com                                        | s3_bucket              |          |            | reports.nwmotorsport.com                                        |
| new    | aws://120126178335/us-east-1/s3/bucket/resources.nwmsrocks.com                                         | s3_bucket              |          |            | resources.nwmsrocks.com                                         |
| new    | aws://120126178335/us-east-1/s3/bucket/retention.nwmsrocks.com                                         | s3_bucket              |          |            | retention.nwmsrocks.com                                         |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-apparel-export                                         | s3_bucket              |          |            | reynolds-apparel-export                                         |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-data                                                   | s3_bucket              |          |            | reynolds-data                                                   |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-data-trigger                                           | s3_bucket              |          |            | reynolds-data-trigger                                           |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-import                                                 | s3_bucket              |          |            | reynolds-import                                                 |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-import-producti-serverlessdeploymentbuck-1r7h2gxn4dryz | s3_bucket              |          |            | reynolds-import-producti-serverlessdeploymentbuck-1r7h2gxn4dryz |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-import-storage                                         | s3_bucket              |          |            | reynolds-import-storage                                         |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-import-test                                            | s3_bucket              |          |            | reynolds-import-test                                            |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-import-title-followup                                  | s3_bucket              |          |            | reynolds-import-title-followup                                  |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-logs                                                   | s3_bucket              |          |            | reynolds-logs                                                   |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-scrape-producti-serverlessdeploymentbuck-41lrus70zb9r  | s3_bucket              |          |            | reynolds-scrape-producti-serverlessdeploymentbuck-41lrus70zb9r  |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-title-import-pr-serverlessdeploymentbuck-rtayvskq7lpt  | s3_bucket              |          |            | reynolds-title-import-pr-serverlessdeploymentbuck-rtayvskq7lpt  |
| new    | aws://120126178335/us-east-1/s3/bucket/reynolds-title-import-storage                                   | s3_bucket              |          |            | reynolds-title-import-storage                                   |
| new    | aws://120126178335/us-east-1/s3/bucket/reynoldsdatapipeline-pro-serverlessdeploymentbuck-6tl0nft3l2wq  | s3_bucket              |          |            | reynoldsdatapipeline-pro-serverlessdeploymentbuck-6tl0nft3l2wq  |
| new    | aws://120126178335/us-east-1/s3/bucket/reynoldsformatcsv-produc-serverlessdeploymentbuck-gossrcoeaxso  | s3_bucket              |          |            | reynoldsformatcsv-produc-serverlessdeploymentbuck-gossrcoeaxso  |
| new    | aws://120126178335/us-east-1/s3/bucket/s3resourcesoptimizeimage-serverlessdeploymentbuck-3873nz3mg4sd  | s3_bucket              |          |            | s3resourcesoptimizeimage-serverlessdeploymentbuck-3873nz3mg4sd  |
| new    | aws://120126178335/us-east-1/s3/bucket/sesleadproxy-production-serverlessdeploymentbucke-ofl8wb4sbltb  | s3_bucket              |          |            | sesleadproxy-production-serverlessdeploymentbucke-ofl8wb4sbltb  |
| new    | aws://120126178335/us-east-1/s3/bucket/smartauction.nwmsrocks.com                                      | s3_bucket              |          |            | smartauction.nwmsrocks.com                                      |
| new    | aws://120126178335/us-east-1/s3/bucket/sonic.nwmsrocks.com                                             | s3_bucket              |          |            | sonic.nwmsrocks.com                                             |
| new    | aws://120126178335/us-east-1/s3/bucket/staff.nwmsrocks.com                                             | s3_bucket              |          |            | staff.nwmsrocks.com                                             |
| new    | aws://120126178335/us-east-1/s3/bucket/staging-cdn.nwmsrocks.com                                       | s3_bucket              |          |            | staging-cdn.nwmsrocks.com                                       |
| new    | aws://120126178335/us-east-1/s3/bucket/store.nwmsrocks.com                                             | s3_bucket              |          |            | store.nwmsrocks.com                                             |
| new    | aws://120126178335/us-east-1/s3/bucket/surenscreentest                                                 | s3_bucket              |          |            | surenscreentest                                                 |
| new    | aws://120126178335/us-east-1/s3/bucket/sync-inventory-images-pr-serverlessdeploymentbuck-1cd96s27vxnm6 | s3_bucket              |          |            | sync-inventory-images-pr-serverlessdeploymentbuck-1cd96s27vxnm6 |
| new    | aws://120126178335/us-east-1/s3/bucket/temporary.nwmsrocks.com                                         | s3_bucket              |          |            | temporary.nwmsrocks.com                                         |
| new    | aws://120126178335/us-east-1/s3/bucket/test-20181123084220-deployment                                  | s3_bucket              |          |            | test-20181123084220-deployment                                  |
| new    | aws://120126178335/us-east-1/s3/bucket/trades.nwmsrocks.com                                            | s3_bucket              |          |            | trades.nwmsrocks.com                                            |
| new    | aws://120126178335/us-east-1/s3/bucket/truckstrucksandmoretrucks.com                                   | s3_bucket              |          |            | truckstrucksandmoretrucks.com                                   |
| new    | aws://120126178335/us-east-1/s3/bucket/upload-inventory.nwmsrocks.com                                  | s3_bucket              |          |            | upload-inventory.nwmsrocks.com                                  |
| new    | aws://120126178335/us-east-1/s3/bucket/vapor-us-west-2-1652211478                                      | s3_bucket              |          |            | vapor-us-west-2-1652211478                                      |
| new    | aws://120126178335/us-east-1/s3/bucket/vapor-us-west-2-1652238652                                      | s3_bucket              |          |            | vapor-us-west-2-1652238652                                      |
| new    | aws://120126178335/us-east-1/s3/bucket/vapor-us-west-2-1652244502                                      | s3_bucket              |          |            | vapor-us-west-2-1652244502                                      |
| new    | aws://120126178335/us-east-1/s3/bucket/vapor-us-west-2-assets-1652211478                               | s3_bucket              |          |            | vapor-us-west-2-assets-1652211478                               |
| new    | aws://120126178335/us-east-1/s3/bucket/vapor-us-west-2-assets-1652238652                               | s3_bucket              |          |            | vapor-us-west-2-assets-1652238652                               |
| new    | aws://120126178335/us-east-1/s3/bucket/vapor-us-west-2-assets-1652244502                               | s3_bucket              |          |            | vapor-us-west-2-assets-1652244502                               |
| new    | aws://120126178335/us-east-1/s3/bucket/vauto-export                                                    | s3_bucket              |          |            | vauto-export                                                    |
| new    | aws://120126178335/us-east-1/s3/bucket/vauto-import-storage                                            | s3_bucket              |          |            | vauto-import-storage                                            |
| new    | aws://120126178335/us-east-1/s3/bucket/vauto-update-production-serverlessdeploymentbucke-2qys16t4zxx7  | s3_bucket              |          |            | vauto-update-production-serverlessdeploymentbucke-2qys16t4zxx7  |
| new    | aws://120126178335/us-east-1/s3/bucket/video.nwmsrocks.com                                             | s3_bucket              |          |            | video.nwmsrocks.com                                             |
| new    | aws://120126178335/us-east-1/s3/bucket/wallet.nwmsrocks.com                                            | s3_bucket              |          |            | wallet.nwmsrocks.com                                            |
| new    | aws://120126178335/us-east-1/s3/bucket/www.nwmotorsport.com                                            | s3_bucket              |          |            | www.nwmotorsport.com                                            |
| new    | aws://120126178335/us-east-1/s3/bucket/www.nwmotorsports.com                                           | s3_bucket              |          |            | www.nwmotorsports.com                                           |
| new    | aws://120126178335/us-east-1/s3/bucket/www.nwmsrocks.com                                               | s3_bucket              |          |            | www.nwmsrocks.com                                               |
| new    | aws://120126178335/us-east-1/s3/bucket/zendesk.nwmsrocks.com                                           | s3_bucket              |          |            | zendesk.nwmsrocks.com                                           |
| new    | aws://120126178335/us-east-1/s3/service                                                                | aws_s3_service         |          | s3         | s3                                                              |

## Downstream Rule

AI summarization, DevOps writes, runtime package object updates, Rovo artifacts, support docs, and Confluence dry-runs/live publishes must process only `new` and `changed` objects plus directly impacted index/shard pages unless a scoped full refresh is approved.
