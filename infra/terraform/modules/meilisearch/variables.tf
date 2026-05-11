variable "name_prefix"           { type = string }
variable "resource_group_name"   { type = string }
variable "location"              { type = string }
variable "container_environment" { type = string }
variable "image"                 { type = string }
variable "cpu"                   { type = number }
variable "memory"                { type = string }
variable "master_key"            { type = string; sensitive = true; default = "" }
variable "tags"                  { type = map(string); default = {} }
