$(function() {
    const { layer, form } = layui;
    // 页面一加载就获取用户信息
    function initUserInfo() {
        axios.get('/my/userinfo')
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('获取用户失败');
                }
                // console.log(res)
                const { data } = res;
                form.val('editForm', data);
            })

    };
    initUserInfo();
    // 表单验证
    form.verify({
        nick: [
            /^\S{1,6}$/,
            '昵称长度必须在1~6个字符之间'
        ]
    });
    // 提交个人资料
    $('.base-info-form').submit(function(e) {
        e.preventDefault();

        axios.post('/my/userinfo', $(this).serialize())
            .then(res => {
                console.log(res);

                if (res.status !== 0) {
                    return layer.msg('修改用户信息失败！')
                }
                layer.msg('修改用户信息成功！');

                window.parent.getUserInfo();
            });

    });

    // 重置按钮
    $('#reset-btn').click(function(e) {
        console.log(1);
        e.preventDefault();
        initUserInfo();


    });







})