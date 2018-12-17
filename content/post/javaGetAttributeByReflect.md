+++
date = "2017-09-19"
tags = ["Java","reflect"]
title = "Java反射获取实体属性"
+++

## Java反射获取实体属性
Java中可以听过反射获取未知实体的属性

```
Field field=message.getClass().getDeclaredField("value");
field.setAccessible(true);
field.get(message);
``` 