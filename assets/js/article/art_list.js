$(function () {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const de = new Date(date);
        var y = de.getFullYear();
        var m = padZero(de.getMonth());
        var d = padZero(de.getDate());
        var hh = padZero(de.getHours());
        var mm = padZero(de.getMinutes());
        var ss = padZero(de.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询的参数对象，将来请求数据的时候需要将请求参数对象提交到服务器
    var obj = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }


    initTable();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: obj,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！');
                }
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 文章数据渲染结束后才会渲染到分页
                renderPager(res.total);
            }
        })
    }


    initCate();
    // 初始化文章分类的方法 
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！');
                }

                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 通过 layui 重新渲染表单区域的UI结构
                form.render();
            }
        })
    }


    // 为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        // console.log(123);
        e.preventDefault();
        // 获取表单中选中项的值 (属性选择器)
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询参数对象 obj 中对应的属性赋值
        obj.cate_id = cate_id;
        obj.state = state;
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable();
    })

    // 定义分页函数
    function renderPager(total) {
        // console.log(total);  
        // 调用 laypage.render() 方法来渲染枫叶的结构
        laypage.render({
            elem: 'pageBox',  // 这里的elem 是ID，不用加#号
            count: total,  // 数据总数
            curr: obj.pagenum,   // 起始页
            limit: obj.pagesize,   // 每页显示的条数
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调时，有两种方式：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (object, first) {
                // 可以通过first的值来判断通过那种方式触发的jump回调函数
                // 如果first的值是 true， 证明是方式二触发的
                // 否则为方式一
                // console.log(object);
                // console.log(object.curr);
                // 把最新的页码值，赋值到 obj 这个查询参数对象中
                obj.pagenum = object.curr;
                obj.pagesize = object.limit;
                if (first) return;
                initTable();
            }

        })
    }

    // 通过代理的方式 为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除按钮的个数
        var len = $('.btn-delete').length;
        console.log(len);
        // 获取文章的 id
        var id = $(this).attr('data-id');
        // 询问用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！');
                    }
                    layer.msg('删除文章成功!');
                    // 
                    if (len === 1) {
                        obj.pagenum = obj.pagenum === 1 ? 1 : obj.pagenum - 1;
                    }
                    initTable();
                }
            })
            layer.close(index);
        })
    })

})
// lay-filter ——> 只有在用 form.val()时，第一个参数的值是：lay-filter的值