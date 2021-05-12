+++
title = "Hazelcast docker"
date = "2021-05-12"
tags = ["docker","hazelcast"]
+++

# 建立网络

```
docker network create --subnet=172.23.0.0/16 hazelcast
```

#  hazelcast

拉镜像
```
docker pull hazelcast/hazelcast:3.7.1
```

运行容器
```
docker run -d -p 5701:5701 --network hazelcast --ip 172.23.0.2 --restart always  hazelcast/hazelcast:3.7.1
```

# 可视化管理工具

拉镜像
```
docker pull hazelcast/management-center:3.12.16
```
运行容器
```
docker run -d -p 8080:8080 --network hazelcast --ip 172.23.0.3 --restart always hazelcast/management-center:3.7.1
```
访问地址
http://localhost:8080/mancenter/login.jsp

配置集群

修改memberIp 172.23.0.2

修改serverURL http://172.23.0.3:8080/mancenter

![](/img/hazelcast.png)

