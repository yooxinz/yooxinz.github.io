+++
date = "2017-04-29"
tags = []
title = "SonarQube文档"
+++

# 1. sonar安装
___
* mysql初始化数据库

```
CREATE DATABASE sonar CHARACTER SET utf8 COLLATE utf8_general_ci; 
CREATE USER 'sonar' IDENTIFIED BY 'sonar';
GRANT ALL ON sonar.* TO 'sonar'@'%' IDENTIFIED BY 'sonar';
GRANT ALL ON sonar.* TO 'sonar'@'localhost' IDENTIFIED BY 'sonar';
FLUSH PRIVILEGES;
```
* SonarQube

[下载地址](https://sonarsource.bintray.com/Distribution/sonarqube/sonarqube-6.3.1.zip)

配置SonarQube服务器sonar.properties

```
sonar.jdbc.url=jdbc:mysql://localhost:3306/sonar?useUnicode=true&characterEncoding=utf8&rewriteBatchedStatements=true&useConfigs=maxPerformance
sonar.jdbc.username=sonar
sonar.jdbc.password=sonar
sonar.sorceEncoding=UTF-8
sonar.login=admin
sonar.password=admin
```
* SonarScanner

[下载地址](https://sonarsource.bintray.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-3.0.1.733.zip)

SonarScanner配置文件sonar-scanner.properties

```
sonar.host.url=http://localhost:9000
sonar.projectKey=hmall-test
sonar.projectName=hmall-test
sonar.sources=src
sonar.language=java
sonar.login=admin
sonar.password=admin
```
## 2.sonarLint安装
___
* 安装sonarLint插件

idea--plugns中查找sonarLint插件，并安装；安装完成后，重启idea；

* sonarLint配置

idea--设置--other setting--SonarLint General Setting--添加sonarQube servers--填写server URL

idea--设置--other setting--SonarLint Project Setting--勾选Enable binding to remote sonarQube server--选择上一步创建的server--选择对应的项目