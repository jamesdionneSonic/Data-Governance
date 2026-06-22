# Published Runtime Package Readback - 2026.6.13-1

## Purpose

Validate that the published Azure Artifacts Universal Package can be downloaded
and read through the runtime package contract without relying on Confluence,
private local source markdown, or path guessing.

## Package

| Field                      | Value                                                                |
| -------------------------- | -------------------------------------------------------------------- |
| Package                    | `sonic-data-lineage-runtime`                                         |
| Version                    | `2026.6.13-1`                                                        |
| Feed                       | `sonic-data-lineage-runtime`                                         |
| Project                    | `Data Warehouse`                                                     |
| Organization               | `https://dev.azure.com/sonicapplicationdevelopment`                  |
| Download cache             | `tmp/rtpkg`                                                          |
| Azure Artifacts manifest   | `7ECA87A69474F45BAE7EAB27DDDF1237BDED4F9D1C089CE59B9661804E7F32BD02` |
| Azure Artifacts super root | `F5AAA5B543A5C7717FA4DA210A31368E03EC4A0972C3005E637A75F675EA5D3402` |
| Package size               | `1020523800` bytes                                                   |

## Commands

The live upload command was attempted:

```powershell
npm run lineage:runtime:publish
```

Azure Artifacts returned:

```text
The package sonic-data-lineage-runtime 2026.6.13-1 already exists in sonic-data-lineage-runtime
```

The already-published package was then downloaded into a clean local cache:

```powershell
az artifacts universal download `
  --organization https://dev.azure.com/sonicapplicationdevelopment `
  --project "Data Warehouse" `
  --scope project `
  --feed sonic-data-lineage-runtime `
  --name sonic-data-lineage-runtime `
  --version 2026.6.13-1 `
  --path "tmp\rtpkg"
```

Readback was run against the downloaded package:

```powershell
$env:LINEAGE_RUNTIME_PACKAGE_ROOT='tmp\rtpkg'
npm run lineage:runtime:readback
```

## Readback Result

```json
{
  "status": "passed",
  "packageName": "sonic-data-lineage-runtime",
  "packageVersion": "2026.6.13-1",
  "runtimeContentHash": "ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e",
  "generatedAt": "2026-06-13T00:13:32.622Z",
  "checks": {
    "catalog": {
      "databaseEntries": 34,
      "sonicDwPresent": true
    },
    "object": {
      "objectId": "L1-5FSQL-01.Sonic_DW.dbo.factFIRE",
      "upstreamCount": 9,
      "downstreamCount": 46,
      "profileTeaserStatus": "not available in package"
    },
    "profileIndex": {
      "runCount": 3753,
      "objectCount": 6031,
      "databaseCount": 8,
      "safe": true
    },
    "ssis": {
      "readmePath": "ssis/README.md",
      "packageRouteDescribed": true
    }
  },
  "policy": {
    "confluenceUsed": false,
    "localSourceMarkdownUsed": false,
    "pathGuessingUsed": false
  },
  "failures": [],
  "decision": "approved-for-local-readback"
}
```

## Important Difference From Current Local Package

The existing feed package uses runtime content hash:

```text
ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e
```

The current local package dry-run reported:

```text
514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff
```

Because the version already exists and the hashes differ, the current local
package hash was not marked as published in `.build-state.json`.

Next publish should use a new package version if the current local package is
the desired runtime package.
