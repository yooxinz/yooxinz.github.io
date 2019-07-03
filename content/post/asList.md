+++
title = "Arrays.asList()学习"
date = "2017-08-22"
tags = ["java"]
+++

#  Arrays.asList() 是泛型方法, 传入的对象必须是对象数组

```
int[] myArray = { 1, 2, 3 };
List myList = Arrays.asList(myArray);
System.out.println(myList.size());//1
System.out.println(myList.get(0));//数组地址值
System.out.println(myList.get(1));//报错：ArrayIndexOutOfBoundsException
```
可以使用包装类数组解决:

```
Integer[] myArray = { 1, 2, 3 };
```
# Arrays.asList() 使用集合的修改方法: add(), remove(), clear()会抛异常

Arrays.asList() 方法返回的并不是 java.util.ArrayList ，而是 java.util.Arrays 的一个内部类,这个内部类并没有实现集合的修改方法或者说并没有重写这些方法。
