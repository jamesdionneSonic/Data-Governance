output "url" {
  description = "Public FQDN of this Container App."
  value       = "https://${azurerm_container_app.this.ingress[0].fqdn}"
}

output "id" {
  description = "Azure resource ID of this Container App."
  value       = azurerm_container_app.this.id
}
