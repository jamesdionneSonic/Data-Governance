# ---------------------------------------------------------------------------
# Root module — Data Governance Platform
# Wires together the resource group, container environment, and app modules.
# ---------------------------------------------------------------------------

locals {
  name_prefix = "${var.project}-${var.environment}"
  common_tags = merge(
    {
      project     = var.project
      environment = var.environment
      managed-by  = "terraform"
    },
    var.tags
  )
}

# ---------------------------------------------------------------------------
# Resource group
# ---------------------------------------------------------------------------

resource "azurerm_resource_group" "main" {
  name     = "rg-${local.name_prefix}"
  location = var.location
  tags     = local.common_tags
}

# ---------------------------------------------------------------------------
# Log Analytics workspace (shared observability sink)
# ---------------------------------------------------------------------------

resource "azurerm_log_analytics_workspace" "main" {
  name                = "log-${local.name_prefix}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.common_tags
}

# ---------------------------------------------------------------------------
# Container Apps environment
# ---------------------------------------------------------------------------

resource "azurerm_container_app_environment" "main" {
  name                       = "cae-${local.name_prefix}"
  location                   = azurerm_resource_group.main.location
  resource_group_name        = azurerm_resource_group.main.name
  log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
  tags                       = local.common_tags
}

# ---------------------------------------------------------------------------
# Meilisearch module
# ---------------------------------------------------------------------------

module "meilisearch" {
  source = "./modules/meilisearch"

  name_prefix           = local.name_prefix
  resource_group_name   = azurerm_resource_group.main.name
  location              = azurerm_resource_group.main.location
  container_environment = azurerm_container_app_environment.main.id
  image                 = var.meilisearch_image
  cpu                   = var.meilisearch_cpu
  memory                = var.meilisearch_memory
  master_key            = var.meilisearch_master_key
  tags                  = local.common_tags
}

# ---------------------------------------------------------------------------
# Backend Container App module
# ---------------------------------------------------------------------------

module "backend" {
  source = "./modules/container-app"

  name_prefix           = local.name_prefix
  resource_group_name   = azurerm_resource_group.main.name
  location              = azurerm_resource_group.main.location
  container_environment = azurerm_container_app_environment.main.id
  image                 = var.backend_image
  cpu                   = var.backend_cpu
  memory                = var.backend_memory
  min_replicas          = var.backend_min_replicas
  max_replicas          = var.backend_max_replicas
  tags                  = local.common_tags

  env_vars = {
    NODE_ENV               = "production"
    PORT                   = "3000"
    MEILISEARCH_HOST       = module.meilisearch.internal_url
    ENTRA_CLIENT_ID        = var.entra_client_id
    ENTRA_TENANT_ID        = var.entra_tenant_id
  }

  secret_env_vars = {
    JWT_SECRET             = var.jwt_secret
    MEILISEARCH_MASTER_KEY = var.meilisearch_master_key
    ENTRA_CLIENT_SECRET    = var.entra_client_secret
  }
}
