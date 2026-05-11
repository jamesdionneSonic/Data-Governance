output "resource_group_name" {
  description = "Name of the provisioned resource group."
  value       = azurerm_resource_group.main.name
}

output "container_environment_id" {
  description = "Azure resource ID of the Container Apps environment."
  value       = azurerm_container_app_environment.main.id
}

output "backend_url" {
  description = "Public FQDN of the backend Container App."
  value       = module.backend.url
}

output "meilisearch_internal_url" {
  description = "Internal Meilisearch URL (accessible within the Container Apps environment)."
  value       = module.meilisearch.internal_url
}

output "log_analytics_workspace_id" {
  description = "Log Analytics workspace resource ID."
  value       = azurerm_log_analytics_workspace.main.id
}
