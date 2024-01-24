terraform {
  required_providers {
#    mongodbatlas = {
#      source = "mongodb/mongodbatlas"
#      version = ">= 0.9.0"
#    }
    google = {
      source  = "hashicorp/google"
      version = "5.12.0"
    }
  }
}

#provider "mongodbatlas" {
#  public_key  = var.atlas_public_key
#  private_key = var.atlas_private_key
#}

provider "google" {
  credentials = jsondecode(var.gcp_credentials)
  project     = "imi-b4"
  region      = "europe-west1"
}
