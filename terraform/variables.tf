variable "server_ip" {
  description = "The IP address of the server to deploy to."
  type        = string
}

variable "server_user" {
  description = "The username for SSH access to the server."
  type        = string
}

variable "server_ssh_port" {
  description = "The port for SSH access to the server."
  type        = number
}

variable "ssh_private_key" {
  description = "The content of the SSH private key for server access."
  type        = string
  sensitive   = true
}