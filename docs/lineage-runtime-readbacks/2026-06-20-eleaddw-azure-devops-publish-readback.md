# eLeadDW Azure DevOps Runtime Publish Readback

Date: 2026-06-20
Work packet: ELDW-010
Approval source: user approved publish after ELDW-009 review

## Result

Published the reviewed eLeadDW machine-readable runtime package to Azure
Artifacts and verified it by downloading the published package into a clean
local cache.

No Confluence publish, cleanup, archive, delete, page move, parser change,
extractor change, lineage-scoring change, auth change, raw-row publication, or
secret publication was performed.

## Published Package

| Field                   | Value                                                              |
| ----------------------- | ------------------------------------------------------------------ |
| Organization            | `https://dev.azure.com/sonicapplicationdevelopment`                |
| Project                 | `Data Warehouse`                                                   |
| Feed                    | `sonic-data-lineage-runtime`                                       |
| Package                 | `sonic-data-lineage-runtime-eleaddw`                               |
| Version                 | `2026.6.20-1`                                                      |
| Runtime content hash    | `471e2ebe932e80df3a058d53a5aa544aa012b194119c1235fe70c36e160560ba` |
| Source package root     | `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run`     |
| Download readback cache | `tmp/eleaddw-rtpkg-2026-6-20-1`                                    |

Azure Artifacts publish returned:

| Field       | Value                                                                |
| ----------- | -------------------------------------------------------------------- |
| ManifestId  | `444C7BD8446EEA2F83493EC394261F9BE2004922A9FEBB00ABC2DA7C0F30D96702` |
| SuperRootId | `EC3F6ECD2DC089465F5DABDF56D91F56A2B3A5D21DD4E98350D0AB9F5904E13C02` |
| Version     | `2026.6.20-1`                                                        |

Azure Artifacts download returned:

| Field       | Value                                                                |
| ----------- | -------------------------------------------------------------------- |
| ManifestId  | `444C7BD8446EEA2F83493EC394261F9BE2004922A9FEBB00ABC2DA7C0F30D96702` |
| SuperRootId | `EC3F6ECD2DC089465F5DABDF56D91F56A2B3A5D21DD4E98350D0AB9F5904E13C02` |
| PackageSize | `4272134`                                                            |
| Version     | `2026.6.20-1`                                                        |

## Commands

Publish dry run:

```powershell
node scripts/publish-lineage-runtime-package.mjs --dry-run --package-root=data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run --name=sonic-data-lineage-runtime-eleaddw --version=2026.6.20-1
```

Live publish:

```powershell
node scripts/publish-lineage-runtime-package.mjs --package-root=data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run --name=sonic-data-lineage-runtime-eleaddw --version=2026.6.20-1
```

Published package download:

```powershell
az artifacts universal download --organization https://dev.azure.com/sonicapplicationdevelopment --project "Data Warehouse" --scope project --feed sonic-data-lineage-runtime --name sonic-data-lineage-runtime-eleaddw --version 2026.6.20-1 --path tmp\eleaddw-rtpkg-2026-6-20-1
```

## Downloaded Package Readback

Readback was run against the downloaded package cache, not the source dry-run
folder.

| Check                                         | Result |
| --------------------------------------------- | ------ |
| Downloaded package manifest opened            | passed |
| Runtime content hash matches approved dry run | passed |
| Registry row count is 440                     | passed |
| Alias key count is 1,320                      | passed |
| Runtime validation status is passed           | passed |
| `dwFullOpportunity` found                     | passed |

Downloaded-package readback facts:

| Signal                             | Value  |
| ---------------------------------- | ------ |
| Canonical objects                  | 440    |
| Registry rows                      | 440    |
| Alias keys                         | 1,320  |
| Context packs                      | 440    |
| Answer cards                       | 2,200  |
| Positive upstream/downstream edges | 308    |
| Review-needed edges                | 27,618 |

`dwFullOpportunity` resolved from the downloaded package:

| Field                    | Value                                                         |
| ------------------------ | ------------------------------------------------------------- |
| Object id                | `sql_server:L1-DWASQL-02,12010.eLeadDW.dbo.dwFullOpportunity` |
| Column count             | 75                                                            |
| Upstream count           | 4                                                             |
| Downstream count         | 0                                                             |
| Lineage confidence       | `mixed`                                                       |
| Review-needed edge count | 4                                                             |

## Build State

The publish wrapper recorded the published hash and version in:

`data/lineage-runtime-package-dry-run/.build-state.json`

Recorded values:

| Field                               | Value                                                              |
| ----------------------------------- | ------------------------------------------------------------------ |
| package_name                        | `sonic-data-lineage-runtime-eleaddw`                               |
| last_published_version              | `2026.6.20-1`                                                      |
| last_published_runtime_content_hash | `471e2ebe932e80df3a058d53a5aa544aa012b194119c1235fe70c36e160560ba` |

## Caveats

The package was intentionally published as a scoped eLeadDW package named
`sonic-data-lineage-runtime-eleaddw`, not as a replacement for the approved full
`sonic-data-lineage-runtime` package.

The package manifest still reflects the dry-run artifact's original internal
fields, including `package_name: eleaddw-runtime-dry-run` and
`safety.azure_devops_published: false`. Publication proof is therefore the Azure
Artifacts upload/download result and this readback record, not that pre-publish
manifest field.

The `column_match` edges remain review-needed evidence. They must not be
presented as confirmed business lineage.

## Stop Point

ELDW-010 is complete.

ELDW-011, Confluence human and Rovo publish, has not been started and still
requires separate explicit approval.
