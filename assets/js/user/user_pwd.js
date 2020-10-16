$(function () {
    // 获取form对象
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        // [/^[/S]{6,12}$/]
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        samepwd: function (value) {
            var pwd = $('[name=oldPwd]').val();
            if (value === pwd) {
                return '新旧密码不能相同！'
            }
        },
        repwd: function (value) {
            var pwd = $('[name=newPwd]').val();
            if (value !== pwd) {
                return '两次密码不一致！'
            }
        }
    })


    // 重置密码
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        console.log(23);
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('重置密码失败!');
                }
                layer.msg('重置密码成功！');
                // 重置密码成功后要清空密码框中的内容，也就是重置密码框
                $('.layui-form')[0].reset();
                // 重置密码后跳转到登录界面，重新进行登录
                window.parent.location.href = '/login.html';
            }
        })
    })


})