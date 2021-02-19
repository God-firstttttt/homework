$(function() {
    const { form } = layui;
    var state = null;

    // 从服务器获取文章的分类列表数据
    function grtCateList() {
        axios.get('/my/article/cates')
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                };

                // 遍历数组，渲染下拉组件的选项
                res.data.forEach(item => {

                    $('#cate-sel').append(`<option value="${item.Id}">${item.name}</option>`);

                });

                form.render('select');
            })

    };
    grtCateList();

    // 初始化富文本编辑区域
    initEditor();


    const $image = $('#image');
    const options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    };


    $image.cropper(options);
    // 为选择封面按钮绑定事件
    $('#choose-btn').click(function() {
        $('#file').click();
    });


    // 为file绑定change事件
    $('#file').change(function() {

        const imgUrl = URL.createObjectURL(this.files[0]);
        $image.cropper('replace', imgUrl);

    });

    // 监听表单提交事件
    $('.publish-form').submit(function(e) {
        e.preventDefault();
        const fd = new FormData(this);
        fd.forEach(item => {
            console.log(item);
        });
        fd.append('state', state);
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(blob => {
            console.log(blob);
            fd.append('cover_img', blob);

            publishArticle(fd);
        })
    });

    // 点击发布和存为草稿按钮，改变state状态值
    $('.last-row button').click(function(e) {
        state = $(this).data('state')
    });

    // 发送请求
    function publishArticle(fd) {
        axios.post('/my/article/add', fd)
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg(state == '草稿' ? '发布草稿成功！' : '发布文章成功！')
                location.href = './list.html';
                window.parent.$('.layui-this').prev().find('a').click();
            });
    }






});