
resource "null_resource" "deploy" {
  # このリソースは、トリガーが変更されるたびに再作成されます
  triggers = {
    always_run = timestamp()
  }

  connection {
    type        = "ssh"
    user        = var.server_user
    host        = var.server_ip
    port        = var.server_ssh_port
    private_key = var.ssh_private_key
  }

  provisioner "remote-exec" {
    inline = [
      "cd /home/dokkiitech/DIGITKITAQ/GeeTech", 
      "git pull",
      "npm i",
      "npm run build",
      "pm2 restart GeeTech",
      "echo 'Deployment completed successfully!'"
    ]
  }
}