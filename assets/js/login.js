$(function() {
    const { form, layer } = layui;
    $('.link a').click(function() {
        $('.layui-form').toggle();
    });

    form.verify({
        pass: [
            /^\w{6,12}$/,
            '密码只能在6到12位之间'
        ],
        samePass: function(value) {
            if (value != $('#pass').val())
                return '两次密码输入不一致'
        }
    });

    // 注册
    $('.reg-form').submit(function(e) {
        e.preventDefault();
        axios.post('/api/reguser', $(this).serialize())
            .then(res => {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg('注册失败');
                };
                layer.msg('注册成功，请登录')
                $('.reg-form a').click();
            })
    });
    $('.login-form').submit(function(e) {
        e.preventDefault();
        axios.post('/api/login', $(this).serialize())
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('登录失败');
                };
                localStorage.setItem('token', res.token);
                layer.msg('登录成功', { time: 1000 }, function() {
                    location.href = './index.html'
                })
            })

    })



})