$(function () {
    // 调用 getUserInfo 函数
    getUserInfo();

    // layer 
    layer = layui.layer;

    // 退出功能
    $('#btnLogout').on('click', function () {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', function (index) {
            //do something
            // 1. 清空本地存储
            localStorage.removeItem('token');
            // 2. 重新跳转到登录界面
            location.href = '/login.html';
            // 关闭询问框
            layer.close(index);
        });
    })
})

// 获取 用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token' || ''),
        // },
        success: function (res) {
            // console.log(res);
            // 判断
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！');
            }
            // 调用渲染用户头像的函数
            renderAvatar(res.data);
        },
        // // 无论是成功还是失败，最终都会调用这个 complete函数
        // complete: function (res) {
        //     // console.log('执行了 complete函数');
        //     // console.log(res);
        //     // 在complete回调函数中，可以使用 res.responseJSON拿回服务器响应的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 强制清空 localStorage 中的数据
        //         localStorage.removeItem('token');
        //         // 强制跳转到登录界面
        //         location.href = "/login.html";
        //     }
        // }
    })
}
// 获取用户头像的函数 渲染用户头像
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 判断是否有图片对象
    if (user.user_pic !== null) {
        // 如果有，图片对象
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avater').hide();
    } else {
        // 如果没有，文字头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avater').html(first).show();
    }
}