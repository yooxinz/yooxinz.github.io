+++
title = "Git忽略规则及.gitignore规则不生效的解决办法"
date = "2017-05-01"
tags = ["git"]
+++

* 先创建的项目后添加.gitignore文件时遇到不生效的情况

```

git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```
