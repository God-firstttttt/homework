$(function() {

    const $image = $('#image');
    // 配置选项
    $image.cropper({
        aspectRatio: 1,
        preview: '.img-preview',

    });
    // 点击上传按钮， 上传图片
    $('#uploade-btn').click(function() {
        $('#file').click();
    });

    // 监听图片文件上传
    $('#file').change(function() {
        // console.log(this.files);
        if (this.files.length == 0) {
            return;
        }

        const imgUrl = URL.createObjectURL(this.files[0]);
        $image.cropper('replace', imgUrl);


    });
    // 点击确定上传到图片服务器上
    $('#sava-btn').click(function() {

        const dataUrl = $image.cropper('getCroppedCanvas', {
            width: 100,
            height: 100
        }).toDataURL('image/jpeg');

        // 构建查询参数
        const search = new URLSearchParams();
        search.append('avatar', dataUrl);

        axios.post('/my/update/avatar', search)
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('上传失败');
                };
                layer.msg('上传成功')
                window.parent.getUserInfo();
            })
    })




























})