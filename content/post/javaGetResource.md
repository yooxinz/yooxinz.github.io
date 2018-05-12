+++
date = "2017-08-09"
tags = ["Java","Resource"]
title = "Java中获取资源文件"
+++
<!--more-->

##Java中获取资源文件
Java中可以通过getClass().getResource()方法获取资源文件

比如我们有以下目录

```
|--project
    |--src
        |--main
            |--java
                |--Test.java
                |--file.txt
    |--target
        |--classes
            |--Test.class
            |--file.txt
``` 
     
现在要在Test.java中获取file文件

```
getClass().getResource("file.txt")
```
或者

```
getClass().getResource("/file.txt")
```
这里指定的路径可以为以Test.class为相对路径,也可以指定以classes为根的绝对路径