
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
      "git pull origin main",
      "git submodule update --init --recursive",
      "cd GeeTech-ProductHP && git checkout main && git pull origin main && cd ..",
      "git add GeeTech-ProductHP",
      "git commit -m 'Update submodule to latest main' || true",
      "/home/linuxbrew/.linuxbrew/bin/npm i",
      "cd GeeTech-ProductHP && /home/linuxbrew/.linuxbrew/bin/npm i && cd ..",
      "/home/linuxbrew/.linuxbrew/bin/npm run build:both",
      "/home/dokkiitech/.nvm/versions/node/v22.16.0/bin/pm2 restart GeeTech",
      "echo 'Deployment completed successfully!'"
    ]
  }
}