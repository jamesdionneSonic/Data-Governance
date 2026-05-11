variable "name_prefix"           { type = string }
variable "resource_group_name"   { type = string }
variable "location"              { type = string }
variable "container_environment" { type = string }
variable "image"                 { type = string }
variable "cpu"                   { type = number }
variable "memory"                { type = string }
variable "min_replicas"          { type = number; default = 1 }
variable "max_replicas"          { type = number; default = 5 }
variable "tags"                  { type = map(string); default = {} }

variable "env_vars" {
  description = "Plain-text environment variables for the container."
  type        = map(string)
  default     = {}
}

variable "secret_env_vars" {
  description = "Secret environment variables injected as Container App secrets."
  type        = map(string)
  sensitive   = true
  default     = {}
}
