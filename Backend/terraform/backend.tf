resource "google_cloud_run_v2_service" "backend" {
  name     = "hypnobuddy-backend"
  location = "europe-west1"
#  ingress = "INGRESS_TRAFFIC_ALL"

  template {
    containers {
      image = "justingebert/hypnobuddy:test11"
#      resources {
#        # If true, garbage-collect CPU when once a request finishes
#        cpu_idle = false
#      }
      env {
        name = "MONGO_URL"
        value = data.google_secret_manager_secret_version.mongo_url.secret_data
      }
    }
  }
}


