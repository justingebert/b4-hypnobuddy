#variable "atlas_public_key" {
#  description = "Public key for MongoDB Atlas API"
#  type = string
#}
#
#variable "atlas_private_key" {
#  description = "Private key for MongoDB Atlas API"
#  type = string
#}
#
#variable "atlas_project_id" {
#  description = "The MongoDB Atlas Project ID"
#  type = string
#}

data "google_secret_manager_secret_version" "mongo_url" {
  secret = "mongo_url"
  version = "latest"
}

variable "gcp_credentials" {
  description = "GCP JSON credentials"
  type        = any
}