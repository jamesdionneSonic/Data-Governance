# Infrastructure as Code — Data Governance Platform

This directory contains the Terraform-based IaC baseline for the Data Governance Platform.  
It satisfies **FR-PLAT-001** from [`docs/PRODUCT_REQUIREMENTS.md`](../docs/PRODUCT_REQUIREMENTS.md).

## Directory layout

```
infra/
├── README.md               ← this file
├── .terraform-version      ← pinned Terraform version
└── terraform/
    ├── providers.tf        ← provider declarations
    ├── versions.tf         ← version constraints
    ├── main.tf             ← root module wiring
    ├── variables.tf        ← all input variables
    ├── outputs.tf          ← published outputs
    ├── environments/
    │   ├── dev.tfvars      ← dev overrides
    │   └── prod.tfvars     ← prod overrides
    └── modules/
        ├── container-app/  ← Azure Container App module
        └── meilisearch/    ← Meilisearch container module
```

## Requirements

| Tool                          | Minimum version |
| ----------------------------- | --------------- |
| Terraform                     | 1.7.0           |
| Azure CLI                     | 2.55.0          |
| Provider: `hashicorp/azurerm` | ~> 3.90         |

## Usage

### 1. Authenticate to Azure

```bash
az login
az account set --subscription "<SUBSCRIPTION_ID>"
```

### 2. Initialize

```bash
cd infra/terraform
terraform init
```

### 3. Validate & plan (no cloud required for validate)

```bash
# Validate HCL syntax and provider schemas
terraform validate

# Review the execution plan for dev
terraform plan -var-file=environments/dev.tfvars
```

### 4. Apply (requires Azure subscription)

```bash
terraform apply -var-file=environments/dev.tfvars
```

> **Note:** The CI pipeline runs `terraform validate` and `terraform plan` automatically on every pull request.  
> `terraform apply` is a **manual, protected operation**. No automated apply runs in CI.

## Environment variables required for plan/apply

| Variable              | Description                                              |
| --------------------- | -------------------------------------------------------- |
| `ARM_SUBSCRIPTION_ID` | Azure subscription GUID                                  |
| `ARM_TENANT_ID`       | Azure Entra tenant GUID                                  |
| `ARM_CLIENT_ID`       | Service principal / managed identity client ID           |
| `ARM_CLIENT_SECRET`   | Service principal secret (use GitHub secret / key vault) |

## Guardrails

- **No manual changes** to production infrastructure. All changes via PR → plan review → apply.
- **State backend**: Azure Blob (see `providers.tf` backend block — configure before first apply).
- **Secrets**: Never commit secrets to `*.tfvars`. Use environment variables or Azure Key Vault references.
- CI will block merge on `terraform validate` or `terraform fmt -check` failure.

## Related documentation

- [Deployment Guide](../docs/DEPLOYMENT_GUIDE.md)
- [Product Requirements — FR-PLAT-001](../docs/PRODUCT_REQUIREMENTS.md)
- [Branch Protection Setup](../docs/BRANCH_PROTECTION_SETUP.md)
- [Cloud Migration Runbook](../docs/CLOUD_MIGRATION_RUNBOOK.md)
