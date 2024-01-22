resource "mongodbatlas_cluster" "my_cluster" {
  project_id             = var.atlas_project_id
  name                   = "Hypnobuddy"
  provider_instance_size_name = "M0"
  provider_name               = "AWS"
  provider_region_name        = "eu-central-1"  # Frankfurt region
  backup_enabled              = false
}
