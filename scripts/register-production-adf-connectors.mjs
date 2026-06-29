import 'dotenv/config';

import {
  getConnector,
  upsertConnector,
} from '../src/services/connectorService.js';

const actor = {
  id: 'system',
  name: 'System',
  role: 'admin',
  roles: ['Admin'],
};

const tenantId = 'b7944855-1c04-4fee-8f07-749ae6f28735';
const subscriptionId = 'bee9b611-da99-4cfc-9fb7-50f1359e5ca2';

const metadataTargets = [
  'factory',
  'pipelines',
  'activities',
  'datasets',
  'linked services',
  'triggers',
  'data flows',
  'integration runtimes',
  'managed virtual networks',
  'managed private endpoints',
  'lineage edges',
  'bounded run history',
  'bounded activity run history',
];

const factories = [
  {
    id: 'azure-data-factory-adf-admin-d1',
    label: 'ADF Admin D1',
    factoryName: 'adf-Admin-D1',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for admin-oriented data movement in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-dw-caroffer-prod',
    label: 'ADF DW CarOffer Prod',
    factoryName: 'adf-dw-caroffer-prod',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for DW CarOffer pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-dw-lightspeed-prod',
    label: 'ADF DW Lightspeed Prod',
    factoryName: 'adf-dw-lightspeed-prod',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for DW Lightspeed pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-dw-marketing-prod',
    label: 'ADF DW Marketing Prod',
    factoryName: 'adf-dw-marketing-prod',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for DW marketing pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-dw-postgres-prod',
    label: 'ADF DW Postgres Prod',
    factoryName: 'adf-dw-postgres-prod',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for DW Postgres pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-elead-d1',
    label: 'ADF eLead D1',
    factoryName: 'adf-eLead-D1',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for eLead pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-facebookads-d1',
    label: 'ADF Facebook Ads D1',
    factoryName: 'adf-FacebookAds-D1',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for Facebook Ads pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-ganalytics-d1',
    label: 'ADF GAnalytics D1',
    factoryName: 'adf-GAnalytics-D1',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for Google Analytics pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-googlesearch-d1',
    label: 'ADF Google Search D1 Legacy',
    factoryName: 'adf-GoogleSearch-D1',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Legacy production Azure Data Factory for Google Search pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-inbounddataetl-prod',
    label: 'ADF InboundDataETL Prod',
    factoryName: 'ADF-InboundDataETL-Prod',
    resourceGroup: 'RG-InboundDataServices-Prod',
    description: 'Production Azure Data Factory for inbound data ETL pipelines in RG-InboundDataServices-Prod.',
  },
  {
    id: 'azure-data-factory-adf-mci-d1',
    label: 'ADF MCI D1',
    factoryName: 'adf-MCI-D1',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for MCI pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-pricefx-d1',
    label: 'ADF PriceFx D1',
    factoryName: 'adf-PriceFx-D1',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for PriceFx pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-reconpro-d1',
    label: 'ADF ReconPro D1',
    factoryName: 'adf-ReconPro-D1',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for ReconPro pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-reputationmgmt-d1',
    label: 'ADF ReputationMgmt D1',
    factoryName: 'adf-ReputationMgmt-D1',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Production Azure Data Factory for reputation-management pipelines in rg-data-warehouse-prod.',
  },
  {
    id: 'azure-data-factory-adf-vehiclemart-prod',
    label: 'ADF VehicleMart Prod',
    factoryName: 'ADF-VehicleMart-Prod',
    resourceGroup: 'RG-VehicleMart-Prod',
    description: 'Production Azure Data Factory for VehicleMart pipelines in RG-VehicleMart-Prod.',
  },
  {
    id: 'azure-data-factory-adf-xtime-d1',
    label: 'ADF XTime D1 Legacy',
    factoryName: 'adf-XTime-D1',
    resourceGroup: 'rg-data-warehouse-prod',
    description: 'Legacy production Azure Data Factory for XTime pipelines in rg-data-warehouse-prod.',
  },
];

const saved = factories.map((factory) => {
  const connector = upsertConnector(
    {
      id: factory.id,
      type: 'azure_data_factory',
      label: factory.label,
      description: factory.description,
      config: {
        tenant_id: tenantId,
        subscription_id: subscriptionId,
        resource_group: factory.resourceGroup,
        factory_name: factory.factoryName,
        azure_cli_timeout_ms: 30000,
        run_history_lookback_days: 30,
        activity_run_pipeline_limit: 50,
      },
      credential: {
        mode: 'azure_cli',
      },
      metadata_targets: metadataTargets,
    },
    actor
  );

  return {
    id: connector.id,
    label: connector.label,
    factory_name: connector.config.factory_name,
    resource_group: connector.config.resource_group,
    persisted: Boolean(getConnector(connector.id, actor)),
  };
});

console.log(
  JSON.stringify(
    {
      status: 'saved',
      connector_count: saved.length,
      connectors: saved,
    },
    null,
    2
  )
);
