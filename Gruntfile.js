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
