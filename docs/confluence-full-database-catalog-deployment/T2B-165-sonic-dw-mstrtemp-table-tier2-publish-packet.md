# T2B-165 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-165`    |
| Platform/Product      | `SQL Server` |
| Database              | `Sonic_DW`   |
| Schema                | `mstrtemp`   |
| Object type scope     | `table`      |
| Object pages          | 75           |
| Link refresh pages    | 2            |
| Total planned entries | 79           |
| Validation status     | `passed`     |

## Object Pages

| Object                  | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                               |
| ----------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------- |
| `DM_AdvertisingExpense` | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / DM_AdvertisingExpense` |
| `DM_ServicePivot`       | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / DM_ServicePivot`       |
| `T001BW1NXMD002`        | table | profiled, review-needed | 0          | 100     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T001BW1NXMD002`        |
| `T077Y91YGMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T077Y91YGMD000`        |
| `T093KZH51MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T093KZH51MD000`        |
| `T0IAD6T82MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T0IAD6T82MD000`        |
| `T0O01E2KCMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T0O01E2KCMD000`        |
| `T0PXARGQIMD002`        | table | profiled, review-needed | 0          | 100     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T0PXARGQIMD002`        |
| `T0SFNXIGKMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T0SFNXIGKMD000`        |
| `T1LEMG40XMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T1LEMG40XMD000`        |
| `T1NB08MFWMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T1NB08MFWMD000`        |
| `T1X58NQDGMD000`        | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T1X58NQDGMD000`        |
| `T1YHDLV1LMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T1YHDLV1LMD000`        |
| `T2CKBOWJ9MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T2CKBOWJ9MD000`        |
| `T2H7IKII2MD001`        | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T2H7IKII2MD001`        |
| `T2HLUFXA4MD003`        | table | profiled, review-needed | 0          | 37      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T2HLUFXA4MD003`        |
| `T2TPC7ZQ4MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T2TPC7ZQ4MD000`        |
| `T2Z441FVDMD001`        | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T2Z441FVDMD001`        |
| `T36H7C3QCMD001`        | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T36H7C3QCMD001`        |
| `T3A5MSQ0WMD002`        | table | profiled, review-needed | 0          | 65      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T3A5MSQ0WMD002`        |
| `T3EPB206BMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T3EPB206BMD000`        |
| `T3I7D2QE5MD001`        | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T3I7D2QE5MD001`        |
| `T3IQ50EO8MD000`        | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T3IQ50EO8MD000`        |
| `T3VVGNEL7MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T3VVGNEL7MD000`        |
| `T3ZY27CAZMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T3ZY27CAZMD000`        |
| `T4CD61ICGMD001`        | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T4CD61ICGMD001`        |
| `T4FWDZQLGMD001`        | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T4FWDZQLGMD001`        |
| `T4LAKCARVMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T4LAKCARVMD000`        |
| `T4Q012ZWOMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T4Q012ZWOMD000`        |
| `T4VIWDPMUMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T4VIWDPMUMD000`        |
| `T56015POSMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T56015POSMD000`        |
| `T5K01AB15MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T5K01AB15MD000`        |
| `T5K01NK9MMD000`        | table | profiled, review-needed | 0          | 64      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T5K01NK9MMD000`        |
| `T5MSV730CMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T5MSV730CMD000`        |
| `T5R9SLXDPMD000`        | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T5R9SLXDPMD000`        |
| `T5U1DYWNOMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T5U1DYWNOMD000`        |
| `T62RDT8D4MD002`        | table | profiled, review-needed | 0          | 100     | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T62RDT8D4MD002`        |
| `T64SZ2KFHMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T64SZ2KFHMD000`        |
| `T6H3Y6KPCMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T6H3Y6KPCMD000`        |
| `T6JFWQYPPMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T6JFWQYPPMD000`        |
| `T6R413NDZMD000`        | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T6R413NDZMD000`        |
| `T6SX3RFNUMD001`        | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T6SX3RFNUMD001`        |
| `T6W01VM23MD002`        | table | profiled, review-needed | 0          | 89      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T6W01VM23MD002`        |
| `T6XRS7WU8MD001`        | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T6XRS7WU8MD001`        |
| `T73PW9LCSMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T73PW9LCSMD000`        |
| `T7DKUCREGMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T7DKUCREGMD000`        |
| `T7S01L4ZWMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T7S01L4ZWMD000`        |
| `T890ETF7LMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T890ETF7LMD000`        |
| `T8IEJC05IMD002`        | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T8IEJC05IMD002`        |
| `T8ML1YKC8MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T8ML1YKC8MD000`        |
| `T8O019FA8MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T8O019FA8MD000`        |
| `T8VYM4CNCMD001`        | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T8VYM4CNCMD001`        |
| `T925D87XOMD002`        | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T925D87XOMD002`        |
| `T95OPPYQGMD001`        | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T95OPPYQGMD001`        |
| `T9DTS6ESIMD000`        | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T9DTS6ESIMD000`        |
| `T9LKWPYJLMD002`        | table | profiled, review-needed | 0          | 11      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T9LKWPYJLMD002`        |
| `T9M2MY5S0MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T9M2MY5S0MD000`        |
| `T9UF99UU8MD001`        | table | profiled, review-needed | 0          | 18      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / T9UF99UU8MD001`        |
| `TA48XBH7RMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TA48XBH7RMD000`        |
| `TA8ZB3E75MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TA8ZB3E75MD000`        |
| `TAB4Z7WWGMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TAB4Z7WWGMD000`        |
| `TAFZBI0S8MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TAFZBI0S8MD000`        |
| `TAG9ZUI2BMD001`        | table | profiled, review-needed | 0          | 67      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TAG9ZUI2BMD001`        |
| `TAT9M2HDTMD002`        | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TAT9M2HDTMD002`        |
| `TAU48OMI3MD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TAU48OMI3MD000`        |
| `TAXBW1GFMMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TAXBW1GFMMD000`        |
| `TAY010ATQMD001`        | table | profiled, review-needed | 0          | 65      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TAY010ATQMD001`        |
| `TAY3152GNMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TAY3152GNMD000`        |
| `TB7L1LQN7MD001`        | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TB7L1LQN7MD001`        |
| `TBC01Z7JQMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TBC01Z7JQMD000`        |
| `TBE01SFUTMD001`        | table | profiled, review-needed | 0          | 2       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TBE01SFUTMD001`        |
| `TBM2VZ2NBMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TBM2VZ2NBMD000`        |
| `TBS01OGVFMD000`        | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TBS01OGVFMD000`        |
| `TBS01ZCOUMD000`        | table | profiled, review-needed | 0          | 16      | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TBS01ZCOUMD000`        |
| `TC801HPH1MD001`        | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp / TC801HPH1MD001`        |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-165:publish
```
