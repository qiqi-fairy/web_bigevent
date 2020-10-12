$(function () {
    // 点击 “link_reg” 的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });
    // 点击 “link_login” 的链接
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    // 在引入layui的JS文件后，就有一个全局的layui的对象
    // 从 layui 中获取 form 对象
    var form = layui.form;
    var layer = layui.layer;

    // 通过 form.verify() 函数自定义校验规则
    form.verify({
        // 自定义一个叫做 pwd 的校验规则  [/^[\S]{6,12}$/] , \S —— 匹配非空格的字符 {6,12} 重复6-12次 [^] —— 取反
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致
        repwd: function (value) {
            // 通过形参拿到的是确认密码框的内容
            // 还需要密码框的内容
            // 然后进行一次是否相等的判断
            // 不相等，则return返回一个提示消息即可
            var pwd = $('.reg-box [name=password]').val();
            if (pwd !== value) {
                return "两次密码不一致";
            }
        }
    })

// 监听注册的表单提交事件
    $('#form_reg').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // POST方式
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        };
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            layer.msg('注册成功!请登录');
            // 模拟人的点击行为（自动跳转到登录界面）
            $('#link_login').click();
        });
    })

// 监听登录的表单提交事件
    $('#form_login').submit(function (e) {
        // 阻止默认提交行为
        e.preventDefault();
        $.ajax({
            url: '/api/login',
            method: 'POST',
            // 快速获取表单中的数据 serialize() 函数
            data: $(this).serialize(), // this ——> form_login的DOM元素
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!');
                }
                layer.msg('登录成功!');
                // 将登陆成功的 token 保存到 localStorage 中，以便于之后访问其他的接口
                localStorage.setItem('token', res.token);
                // 登录成功后跳转到后台主页
                location.href = '/index.html';
            }
        })
    })
})
// $.ajax({
//     url : '',
//     method: '',
//     data： {},
//     success: function(){}
// })


// $.post(url,data,success)