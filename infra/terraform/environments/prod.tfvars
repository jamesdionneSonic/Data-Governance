# ---------------------------------------------------------------------------
# Production environment overrides
# Do NOT commit secret values here. Use TF_VAR_* environment variables.
# ---------------------------------------------------------------------------

environment = "prod"
location    = "eastus"
project     = "dg"

# Backend scaling — production capacity
backend_image        = "ghcr.io/your-org/data-governance:stable"
backend_cpu          = 0.5
backend_memory       = "1.0Gi"
backend_min_replicas = 1
backend_max_replicas = 10

# Meilisearch — production capacity
meilisearch_image  = "getmeili/meilisearch:v1.10"
meilisearch_cpu    = 1.0
meilisearch_memory = "4.0Gi"

tags = {
  cost-center  = "engineering"
  owner        = "platform-team"
  sla          = "99.9"
}
