# ---------------------------------------------------------------------------
# Global variables
# ---------------------------------------------------------------------------

variable "environment" {
  description = "Deployment environment name (dev, staging, prod)."
  type        = string
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "environment must be one of: dev, staging, prod."
  }
}

variable "location" {
  description = "Azure region for all resources."
  type        = string
  default     = "eastus"
}

variable "project" {
  description = "Short project identifier used in resource naming."
  type        = string
  default     = "dg"
}

variable "tags" {
  description = "Additional tags applied to all resources."
  type        = map(string)
  default     = {}
}

# ---------------------------------------------------------------------------
# Backend service
# ---------------------------------------------------------------------------

variable "backend_image" {
  description = "Container image for the Node.js backend (registry/repo:tag)."
  type        = string
  default     = "ghcr.io/your-org/data-governance:latest"
}

variable "backend_cpu" {
  description = "vCPU allocation for the backend container app."
  type        = number
  default     = 0.5
}

variable "backend_memory" {
  description = "Memory allocation (GiB) for the backend container app."
  type        = string
  default     = "1.0Gi"
}

variable "backend_min_replicas" {
  description = "Minimum replica count for the backend container app."
  type        = number
  default     = 1
}

variable "backend_max_replicas" {
  description = "Maximum replica count for the backend container app."
  type        = number
  default     = 5
}

# ---------------------------------------------------------------------------
# Meilisearch
# ---------------------------------------------------------------------------

variable "meilisearch_image" {
  description = "Meilisearch container image tag."
  type        = string
  default     = "getmeili/meilisearch:v1.10"
}

variable "meilisearch_cpu" {
  description = "vCPU allocation for the Meilisearch container app."
  type        = number
  default     = 0.5
}

variable "meilisearch_memory" {
  description = "Memory allocation (GiB) for the Meilisearch container app."
  type        = string
  default     = "2.0Gi"
}

# ---------------------------------------------------------------------------
# Secrets (injected via environment variables — never hardcoded here)
# ---------------------------------------------------------------------------

variable "jwt_secret" {
  description = "JWT signing secret. Supply via TF_VAR_jwt_secret environment variable."
  type        = string
  sensitive   = true
  default     = ""
}

variable "meilisearch_master_key" {
  description = "Meilisearch master key. Supply via TF_VAR_meilisearch_master_key."
  type        = string
  sensitive   = true
  default     = ""
}

variable "entra_client_id" {
  description = "Azure Entra (AAD) application client ID."
  type        = string
  default     = ""
}

variable "entra_client_secret" {
  description = "Azure Entra application client secret. Supply via TF_VAR_entra_client_secret."
  type        = string
  sensitive   = true
  default     = ""
}

variable "entra_tenant_id" {
  description = "Azure Entra tenant ID."
  type        = string
  default     = ""
}
