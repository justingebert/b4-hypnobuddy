resource "google_cloud_run_v2_service" "backend" {
  name     = "hypnobuddy-backend"
  location = "europe-west1"

  template {
    containers {
      image = "justingebert/hypnobuddy:latest"
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

resource "google_cloud_run_service_iam_binding" "default" {
  location = google_cloud_run_v2_service.backend.location
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}


