$(function () {
    // 获取 layer 对象
    var layer = layui.layer;

    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image');
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options);



    // 为上传按钮绑定事件
    $('#btnChooseImg').on('click', function () {
        // 相当于 file 进行了点击事件
        $('#file').click();
    })

    // 为文件选择绑定 change 事件
    $('#file').on('change', function (e) {
        // console.log(e);
        // 获取用户选择的文件
        var filelist = e.target.files;
        // console.log(filelist);
        if (filelist.length === 0) {
            return layer.msg('请选择照片！');
        }

        // 拿到用户选择的文件
        var file = e.target.files[0];
        // console.log(file);
        // 根据选择的文件 创建一个 图片的URL地址
        var newImgURL = URL.createObjectURL(file);
        // 销毁旧的裁剪区域，在设置图片URL地址，然后在渲染成新的裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 为 确定按钮绑定点击事件
    $('#btnUpload').on('click', function () {
        // 先要拿到用户裁剪之后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 调用接口，把头像上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新头像失败!');
                }
                layer.msg('更新头像成功!');
                window.parent.getUserInfo();
            }
        })
    })
})