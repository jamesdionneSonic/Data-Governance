resource "azurerm_container_app" "this" {
  name                         = "ca-${var.name_prefix}-backend"
  container_app_environment_id = var.container_environment
  resource_group_name          = var.resource_group_name
  revision_mode                = "Single"
  tags                         = var.tags

  dynamic "secret" {
    for_each = var.secret_env_vars
    content {
      name  = lower(replace(secret.key, "_", "-"))
      value = secret.value
    }
  }

  template {
    min_replicas = var.min_replicas
    max_replicas = var.max_replicas

    container {
      name   = "backend"
      image  = var.image
      cpu    = var.cpu
      memory = var.memory

      # Plain-text env vars
      dynamic "env" {
        for_each = var.env_vars
        content {
          name  = env.key
          value = env.value
        }
      }

      # Secret-backed env vars
      dynamic "env" {
        for_each = var.secret_env_vars
        content {
          name        = env.key
          secret_name = lower(replace(env.key, "_", "-"))
        }
      }

      liveness_probe {
        transport = "HTTP"
        path      = "/health"
        port      = 3000
      }

      readiness_probe {
        transport = "HTTP"
        path      = "/health"
        port      = 3000
      }
    }

    http_scale_rule {
      name                = "http-scaling"
      concurrent_requests = "30"
    }
  }

  ingress {
    external_enabled = true
    target_port      = 3000
    traffic_weight {
      percentage      = 100
      latest_revision = true
    }
  }
}
