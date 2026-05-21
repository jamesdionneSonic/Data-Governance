resource "azurerm_container_app" "this" {
  name                         = "ca-${var.name_prefix}-meilisearch"
  container_app_environment_id = var.container_environment
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"
  tags                         = var.tags

  secret {
    name  = "meili-master-key"
    value = var.master_key
  }

  template {
    min_replicas = 1
    max_replicas = 1

    container {
      name   = "meilisearch"
      image  = var.image
      cpu    = var.cpu
      memory = var.memory

      env {
        name  = "MEILI_ENV"
        value = "production"
      }

      env {
        name        = "MEILI_MASTER_KEY"
        secret_name = "meili-master-key"
      }

      liveness_probe {
        transport = "HTTP"
        path      = "/health"
        port      = 7700
      }

      readiness_probe {
        transport = "HTTP"
        path      = "/health"
        port      = 7700
      }
    }

    volume {
      name         = "meili-data"
      storage_type = "EmptyDir"
    }
  }

  # Internal only — not exposed publicly
  ingress {
    external_enabled = false
    target_port      = 7700
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}
