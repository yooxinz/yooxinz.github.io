+++
title = "Frp学习"
date = "2019-12-18"
tags = ["network"]
+++

#  frp 是一个可用于内网穿透的高性能的反向代理应用

[github地址](https://github.com/fatedier/frp)

## 服务器端
配置:
```
[common]
bind_port = 7000
vhost_http_port = 7000
```
启动命令
```
./frps -c frps.ini
```

## 客户端
配置:
```
[common]
server_addr = 159.71.44.60
server_port = 7000

[web]
type = http
local_port = 8080
custom_domains = taobao.yooxinz.com
```
启动命令:
```
./frpc -c frpc.ini
```
