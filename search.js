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