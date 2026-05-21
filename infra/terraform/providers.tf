provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = true
    }
    key_vault {
      purge_soft_delete_on_destroy    = false
      recover_soft_deleted_key_vaults = true
    }
  }
}

provider "azuread" {}

provider "random" {}

# ---------------------------------------------------------------------------
# Remote state backend — configure before first apply.
# Uncomment and fill in storage account details, or use a different backend.
# ---------------------------------------------------------------------------
# terraform {
#   backend "azurerm" {
#     resource_group_name  = "rg-dg-tfstate"
#     storage_account_name = "stdgtfstate"
#     container_name       = "tfstate"
#     key                  = "data-governance.tfstate"
#   }
# }
