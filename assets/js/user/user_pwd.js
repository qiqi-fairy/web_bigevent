$(function() {
    // 获取form对象
    var form = layui.form;

    form.verify({
        // [/^[/S]{6,12}$/]
        pwd:  [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'] ,
        samepwd: function(value) {
            var pwd = $('[name=oldpwd]').val();
            if(value === pwd) {
                return '新旧密码不能相同！'
            }
        },
        repwd: function(value) {
            var pwd = $('[name=newpwd]').val();
            if(value !== pwd) {
                return '两次密码不一致！'
            }
        }
    })
})