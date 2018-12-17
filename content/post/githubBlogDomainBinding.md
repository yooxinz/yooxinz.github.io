+++
date = "2017-07-25"
tags = ["github"]
title = "github博客域名绑定"
+++

## github博客域名绑定
通过github创建的blog绑定域名时出现不加载js,css.可以尝试该方法

hugo的config.toml文件中需要指定访问地址

```
baseurl = "https://githubname.github.io"
```
这里的baseurl必须指向blog的github地址.