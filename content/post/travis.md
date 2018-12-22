+++
title = "通过Travis-CI发布博客"
date = "2018-12-22"
tags = ["github"]
+++

通过Travis CI使增加新博客后自动生成对应的站点并上传到Github Page中。

# 在Github中生成Personal access tokens

# 添加认证信息：

在你Travis CI 对应的仓库的Setting页中添加对应的环境变量，变量名为GITHUB_TOKEN，值为之前创建的Personal access tokens。

# 编写CI文件

编写对应的.travis.yml文件

```
sudo: true
dist: trusty

install:
  - sudo apt-get --yes install snapd
  - sudo snap install hugo

script:
  - /snap/bin/hugo

deploy:
  provider: pages
  skip-cleanup: true
  github-token: $GITHUB_TOKEN
  keep-history: true
  target-branch: master
  local-dir: public
  on:
    branch: src
```

[参数解释](https://docs.travis-ci.com/user/deployment/pages/#stq=var&stp=1)：

- target-branch: 生成的站点目标推送分支
- local-dir: 生成站点所在的文件夹路径
