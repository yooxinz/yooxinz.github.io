+++
title = "nginx https认证"
date = "2019-09-09"
tags = ["nginx"]
+++

通过CertBot为nginx配置https。

# 先配置nginx

````
server {
    server_name  taobao.yooxinz.com;

    location / {
       proxy_pass http://localhost:8080;
    }
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
````
# 安装下载certbot

## CentOS/RHEL 7
````
sudo yum install certbot python2-certbot-nginx
````
## 其他版本
前往[certbot官网](https://certbot.eff.org/lets-encrypt/centos6-nginx)

# 生成证书
````
sudo certbot --nginx
````
