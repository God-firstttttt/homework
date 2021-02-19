$(function() {
    const { form } = layui;
    let state = '';
    const arr = location.search.slice(1).split('=');
    const id = arr[1];
    console.log(arr[1]);

    // 发送请求到服务器，获取当前这条id的文章详情
    function getArtDetail(id) {
        axios.get(`/my/article/${id}`)
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取失败!')
                };
                form.val('edit-form', res.data);
                initEditor();
                $image.cropper('replace', 'http://api-breakingnews-web.itheima.net' + res.data.cover_img)
            })
    };
    getArtDetail(id);


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
                // 一定要记得调用 form.render() 方法
                form.render('select');
                getArtDetail(id);
            })

    };
    grtCateList();
    // 初始化图片裁剪器
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
        $image.cropper('getCroppedCanvas', {
            width: 400,
            height: 280
        }).toBlob(blob => {

            const fd = new FormData(this);
            fd.append('state', state);
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
        fd.append('Id', id);
        axios.post('/my/article/edit', fd)
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg(state == '草稿' ? '修改草稿成功！' : '修改文章成功！')
                location.href = './list.html';
                window.parent.$('.layui-this').prev().find('a').click();
            });
    }






});