output "internal_url" {
  description = "Internal URL of the Meilisearch Container App (accessible within the environment)."
  value       = "http://ca-${var.name_prefix}-meilisearch:7700"
}

output "id" {
  description = "Azure resource ID of the Meilisearch Container App."
  value       = azurerm_container_app.this.id
}
