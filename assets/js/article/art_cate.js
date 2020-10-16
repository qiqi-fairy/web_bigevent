$(function () {
    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 添加分类的点击事件
    var indexAdd = null;
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })


    // 通过代理的形式为 form表单(form-add)绑定点击事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    // console.log(res.status);
                    return layui.layer.msg('添加文章分类失败！');
                }
                initArtCateList();
                layui.layer.msg('新增文章分类成功！');
                layui.layer.close(indexAdd);
            }
        })
    })


    // 为编辑按钮绑定点击事件 
    // (事件代理（事件委托： 绑定事件的事交给父元素，因为是后面动态渲染到的，而不是一开始就有的）)
    var indexEdit = null;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id');
        var name = $(this).attr('data-name');
        var alias = $(this).attr('data-alias');
        // console.log(id, name, alias);
        form.val('form-edit', {
            Id: id,
            name: name,
            alias: alias
        })

        // 通过代理的形式为 form表单(form-edit)绑定 submit事件
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault()
            $.ajax({
                method: 'POST',
                url: '/my/article/updatecate',
                data: $(this).serialize(),
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('更新分类数据失败！')
                    }
                    layer.msg('更新分类数据成功！')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })
    })

    // 删除按钮
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id');
        // 
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/'+ id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除分类数据成功！')
                    layer.close(indexEdit)
                    initArtCateList()
                }
            })
        })
    })

})