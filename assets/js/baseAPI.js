// 在每次调用ajax请求时[ $.get() / $.post() / $.ajax() ],都会先去调用ajaxPrefilter这个函数
$.ajaxPrefilter(function (options) {
    // 在发起真正的 ajax 请求之前，统一拼接请求的根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url;
    console.log(options.url);
})