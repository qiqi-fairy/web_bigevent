// 在每次调用ajax请求时[ $.get() / $.post() / $.ajax() ],都会先去调用ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
    // 在发起真正的 ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    // console.log(options.url);

    // 统一为 有权限的接口，设置 headers回调函数
    if(options.url.indexOf('/my/') !== -1 ){
       options.headers ={
        Authorization: localStorage.getItem('token' || '')
       }
    }

    // 全局统一挂载complete函数
    options.complete= function (res) {
        // console.log('执行了 complete函数');
        // console.log(res);
        // 在complete回调函数中，可以使用 res.responseJSON拿回服务器响应的数据
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 强制清空 localStorage 中的数据
            localStorage.removeItem('token');
            // 强制跳转到登录界面
            location.href = "/login.html";
        }
    }

})