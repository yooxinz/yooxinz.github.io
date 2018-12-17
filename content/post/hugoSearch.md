+++
title = "实现Hugo中的搜索功能"
date = "2018-12-17"
tags = ["hugo"]
+++

# 安装需要的组件

## 安装Grunt

```
npm install -g grunt-cli
```

## 安装需要的包工具

```
npm install --save-dev toml string html-entities marked grunt
```

# 生成索引文件

1. 新建Gruntfile文件，并修改其中相关参数。

- CONTENT_PATH_PREFIX：要搜索的内容路径
- FILE_SUFFIX：目标文件的文件后缀名
- FILE_SPLIT：文章头部分隔符
- INDEX_JSON_FILE_PATH：最终生成的索引文件的路径

Gruntfile.js内容如下：

```
var toml = require("toml");
var S = require("string");
var Entities = require('html-entities').AllHtmlEntities;
var Html = new Entities();
var marked = require("marked");

var CONTENT_PATH_PREFIX = "./content/post";
var FILE_SUFFIX = ".md";
var FILE_SPLIT = "+++";
var INDEX_JSON_FILE_PATH = "./static/lunr.json";
var documentsStore = {};

module.exports = function(grunt) {

    grunt.registerTask("index", function() {
		
		 var indexPages = function() {
			//遍历目标路径下所有文件
            grunt.file.recurse(CONTENT_PATH_PREFIX, function(abspath, rootdir, subdir, filename) {
                grunt.verbose.writeln("Parse file:",abspath);
                processFile(abspath, filename);
            });

            return documentsStore;
        };
		
		//处理不同类型的文件
		var processFile = function(abspath, filename) {
            if (S(filename).endsWith(FILE_SUFFIX)){
                processMDFile(abspath, filename);
            }
        };
        //处理markdown文件
		var processMDFile = function(abspath, filename) {
			var body = grunt.file.read(abspath);

			if(!body){
				return null;
			}
			body = body.split(FILE_SPLIT);
			var frontMatter;
			try {
				frontMatter = toml.parse(body[1].trim());
			} catch (e) {
				console.log(e.message);
				return null;
			}
			
			// 生成对应文件连接，用于搜索结果跳转
			var href = S(abspath).chompLeft("content").chompRight(".md").s;
			if (filename === "index.md") {
				href = S(abspath).chompLeft(CONTENT_PATH_PREFIX).chompRight(filename).s;
			}

			// 移除非内容的元素
			var content = body[2].trim();
			content = marked(content);
			content = content.replace(/\<script.*\/script\>/g,"");
			content = Html.decode(content);
			content = content.replace(/(<([^>]+)>)/ig, '');
			content = content.replace(/[\n,\r ]+/g, ' ');
			
			// 可以根据目标文件的格式定义不同的结构体
			var doc = {
				url: href.slice(1),
                title: frontMatter.title,
                date: frontMatter.date,
                tags: frontMatter.tags,
				body: content
			};

			documentsStore[href] = doc;
		};
		
		// 生成的索引文件
		grunt.file.write(INDEX_JSON_FILE_PATH, JSON.stringify(indexPages()));
        grunt.log.ok("Index built");
    });
};
```

1. 执行

```
grunt index
```

# 编写搜索逻辑

搜索逻辑如下：

```
var $results, INDEX_DATA={};
    // 加载索引文件
    function initLunr() {
        // First retrieve the index file
        $.getJSON('/lunr.json')
            .done(function(data) {
                INDEX_DATA = data;
            })
            .fail(function(jqxhr, textStatus, error) {
                var err = textStatus + ", " + error;
                console.error("Error getting Hugo index flie:", err);
            });
    }
    // 开始搜素
    function initUI() {
        $results = $(".content");
        $('#search').on('click',function(){
            $('.content').html("");
            var query = $("#search-input").val();

            var results = search(query,500);
            // 无搜索结果
            if(results === undefined|| results.length===0){
                $("#content-post .noresult").remove();
                $results.append("<h1 class='noresult'>很抱歉，我们没有找到与“"+query+"“相关的博客</h1>");
            }
            else{
                renderResults(results);
            }
        });
    }
    
    function escapeReg(keyword) {
        //escape regexp prevserve word
        return String(keyword).replace(/([\*\.\?\+\$\^\[\]\(\)\{\}\|\/\\])/g, '\\$1');
    }
    
    // 搜索匹配结果
    function search(keyword,MAX_DESCRIPTION_SIZE) {
        if (keyword == null || keyword.trim() === '') return;
    
        var results = [],
            index = -1;
        for (var page in INDEX_DATA) {
            if ((index = INDEX_DATA[page].body.toLowerCase().indexOf(keyword.toLowerCase())) !== -1) {
                results.push({
                    url: INDEX_DATA[page].url,
                    title: INDEX_DATA[page].title,
                    date: INDEX_DATA[page].date,
                    tags: INDEX_DATA[page].tags,
                    body: INDEX_DATA[page].body.substr(Math.max(0, index - 50), MAX_DESCRIPTION_SIZE).replace(new RegExp('(' + escapeReg(keyword) + ')', 'gi'), '<span style="background:#ff0;">$1</span>')
                });
            }
        }
        return results;
    }
    
    // 将搜索结果添加到界面上
    function renderResults(results) {
        if (!results.length) {
            return;
        }
        $(".content .noresult").remove();
        // 只显示10条
        results.slice(0, 10).forEach(function(result) {
            var $result = $('<article class="post">');
            $result.append('<h1><a href="/'+ result.url.toLowerCase() +'" title="'+ result.title +'">'+ result.title +'</a></h1>');

            var $footer = $('<footer class="post-info">Posted on');

            var $span = $('<span class="post-meta">');
            $span.append('<time datetime="'+ result.date +'">'+ result.date +'</time>· Tagged in');
            for (index=0; index < result.tags.length; index++){
                $span.append('<a href="/tags/'+ result.tags[index].toLowerCase() +'">'+result.tags[index]+'</a>')
            }
            $span.append('</span>');

            $footer.append($span);
            $footer.append('</footer>');
            
            $result.append($footer);
            $result.append('<div>'+result.body +'</div>');
            $result.append('<a href="/' + result.url.toLowerCase() +'" title="'+ result.title +'">Read more »</a>');
            $result.append('</article>');
            $results.append($result);
        });
    }

    $(document).ready(function() {
        initLunr();
        initUI();
    });
```

# 最终效果

![](/img/hugoSearch.jpg)