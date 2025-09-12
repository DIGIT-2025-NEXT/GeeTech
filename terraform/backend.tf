terraform {
  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "dokkiitech"

    workspaces {
      name = "GeeTech"
    }
  }
}