$(function () {
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserInfo();

    // 初始化用户的基本信息的函数
    function initUserInfo() {
        $.ajax({
            mehthod: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！');
                }
                // console.log(res);
                // 函数中调用  form.val()第一个参数与lay-filter的属性值相同，第二个参数为后台返回回来的数据对象，input的name需要与对象属性名相同
                // 调用 form.val() 快速为表单赋值
                // form.val() 就是给form表单填充数据用的
                form.val('formUserInfo', res.data);
            }

        })
    }

    // 重置表单的事件
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 重新获取后台最新的数据
        initUserInfo();
    })


    // 监听表单的提交修改事件
    $('.layui-form').on('submit', function (e) {
        // alert(1)
        // 阻止表单的默认重置行为
        e.preventDefault();
        // 发起AJAX的请求
        $.ajax({
            method: 'POST',  // method 一定不能错
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!');
                }
                layer.msg('更新用户信息成功!');
                //  调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
                // console.log(window.parent);
            }
        })
    })
})