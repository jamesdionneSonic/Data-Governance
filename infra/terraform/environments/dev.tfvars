# ---------------------------------------------------------------------------
# Dev environment overrides
# Do NOT commit secret values here. Use TF_VAR_* environment variables.
# ---------------------------------------------------------------------------

environment = "dev"
location    = "eastus"
project     = "dg"

# Backend scaling — minimal for dev
backend_image        = "ghcr.io/your-org/data-governance:latest"
backend_cpu          = 0.25
backend_memory       = "0.5Gi"
backend_min_replicas = 0
backend_max_replicas = 2

# Meilisearch — minimal for dev
meilisearch_image  = "getmeili/meilisearch:v1.10"
meilisearch_cpu    = 0.25
meilisearch_memory = "1.0Gi"

tags = {
  cost-center = "engineering"
  owner       = "platform-team"
}
