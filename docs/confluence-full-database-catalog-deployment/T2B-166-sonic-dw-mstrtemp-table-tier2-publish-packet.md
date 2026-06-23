# T2B-166 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value        |
| --------------------- | ------------ |
| Batch                 | `T2B-166`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `mstrtemp`   |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object           | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                        |
| ---------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------- |
| `TCAYH4P94MD000` | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TCAYH4P94MD000` |
| `TCO011HUEMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TCO011HUEMD000` |
| `TCTV72UNRMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TCTV72UNRMD000` |
| `TCZZ0D7PIMD003` | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TCZZ0D7PIMD003` |
| `TD401AZSSMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TD401AZSSMD000` |
| `TD4KKN8QHMD001` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TD4KKN8QHMD001` |
| `TDGO1SZJIMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TDGO1SZJIMD000` |
| `TDK4XZXJJMD001` | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TDK4XZXJJMD001` |
| `TDXLNP9UAMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TDXLNP9UAMD000` |
| `TDY01JOV6MD000` | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TDY01JOV6MD000` |
| `TDY5XCJI4MD001` | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TDY5XCJI4MD001` |
| `TE9H1GN88MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TE9H1GN88MD000` |
| `TELBMUT2LMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TELBMUT2LMD000` |
| `TEONDXLR5MD000` | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TEONDXLR5MD000` |
| `TEW01HTV1MD002` | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TEW01HTV1MD002` |
| `TF388S7TJMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TF388S7TJMD000` |
| `TFGTFKW3CMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TFGTFKW3CMD000` |
| `TFS0181BQMD001` | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TFS0181BQMD001` |
| `TGC2GU742MD001` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TGC2GU742MD001` |
| `TGO01HLLHMD003` | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TGO01HLLHMD003` |
| `TGO01QRVOMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TGO01QRVOMD000` |
| `TGXRAZVX9MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TGXRAZVX9MD000` |
| `TI001G3OYMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TI001G3OYMD000` |
| `TI001X5STMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TI001X5STMD000` |
| `TIBRW3AYEMD001` | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TIBRW3AYEMD001` |
| `TIYXD9T89MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TIYXD9T89MD000` |
| `TJ1K3LNY6MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TJ1K3LNY6MD000` |
| `TJ5H6FYDIMD004` | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TJ5H6FYDIMD004` |
| `TJ96IEWCDMD000` | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TJ96IEWCDMD000` |
| `TJC01YAWLMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TJC01YAWLMD000` |
| `TJS014TONMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TJS014TONMD000` |
| `TJS01H0EZMD000` | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TJS01H0EZMD000` |
| `TJZYUZBK2MD000` | table | profiled, review-needed | 0          | 64      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TJZYUZBK2MD000` |
| `TK29JDWN5MD000` | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TK29JDWN5MD000` |
| `TK801RU3VMD002` | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TK801RU3VMD002` |
| `TKE5H02GMMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TKE5H02GMMD000` |
| `TKO01JFQPMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TKO01JFQPMD000` |
| `TKO01Q34RMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TKO01Q34RMD000` |
| `TKO01SS4NMD001` | table | profiled, review-needed | 0          | 62      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TKO01SS4NMD001` |
| `TKUT1H7GDMD000` | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TKUT1H7GDMD000` |
| `TKV5QQLP8MD000` | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TKV5QQLP8MD000` |
| `TL55OBGPIMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TL55OBGPIMD000` |
| `TLFCMM9N5MD003` | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TLFCMM9N5MD003` |
| `TLIW1VSSNMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TLIW1VSSNMD000` |
| `TM0TZ0P5WMD000` | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TM0TZ0P5WMD000` |
| `TML6GMK5YMD000` | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TML6GMK5YMD000` |
| `TMSEH1F0RMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TMSEH1F0RMD000` |
| `TMY6TBUGDMD001` | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TMY6TBUGDMD001` |
| `TN5C4I1DXMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TN5C4I1DXMD000` |
| `TN6Q9BJ4OMD001` | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TN6Q9BJ4OMD001` |
| `TNBH288ACMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TNBH288ACMD000` |
| `TNC01IX7BMD002` | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TNC01IX7BMD002` |
| `TNJHY8VCGMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TNJHY8VCGMD000` |
| `TNU4GN1FSMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TNU4GN1FSMD000` |
| `TO4QV234NMD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TO4QV234NMD000` |
| `TO8014T49MD000` | table | profiled, review-needed | 0          | 64      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TO8014T49MD000` |
| `TOKJPHDZ0MD002` | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TOKJPHDZ0MD002` |
| `TOLF8RHY0MD001` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TOLF8RHY0MD001` |
| `TOO01EE4TMD001` | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TOO01EE4TMD001` |
| `TPEBL943HMD002` | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TPEBL943HMD002` |
| `TQ5MUUZEUMD005` | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TQ5MUUZEUMD005` |
| `TQUN1HJB6MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TQUN1HJB6MD000` |
| `TQW01WC3YMD001` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TQW01WC3YMD001` |
| `TQYNNJKE7MQ005` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TQYNNJKE7MQ005` |
| `TR1ZA4Q10MD000` | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TR1ZA4Q10MD000` |
| `TR9IMV9K6MQ000` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TR9IMV9K6MQ000` |
| `TRN0AKP0MMD000` | table | profiled, review-needed | 0          | 17      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TRN0AKP0MMD000` |
| `TS8015AWWMD002` | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TS8015AWWMD002` |
| `TSDKZIMU9MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TSDKZIMU9MD000` |
| `TSIX1BZ6FMD001` | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TSIX1BZ6FMD001` |
| `TSN1I0H2VMD002` | table | profiled, review-needed | 0          | 100     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TSN1I0H2VMD002` |
| `TSORRXV8MMD000` | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TSORRXV8MMD000` |
| `TSSEWI842MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TSSEWI842MD000` |
| `TT3XET0T5MD000` | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TT3XET0T5MD000` |
| `TT744UH01MD004` | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TT744UH01MD004` |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-166:publish
```
