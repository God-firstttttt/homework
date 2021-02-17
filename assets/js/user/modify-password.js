$(function() {
    const { form, layer } = layui;
    // 表单校验
    form.verify({
        pass: [/^\w{6,12}/,
            '密码必须6·12位，切不能出现空格'
        ],
        confirmPass: function(val) {
            if (val !== $('#pass').val()) {
                return '两次密码输入不同';
            }
        }
    });
    // 提交表单
    $('.layui-form').submit(function(e) {
        e.preventDefault();
        axios.post('/my/updatepwd', $(this).serialize())
            .then(res => {
                if (res.status !== 0) {
                    return layer.msg('密码修改失败！');
                }
                layer.msg('密码修改成功！', { time: 1000 }, function() {
                    window.parent.location.href = '../login.html';
                });
                localStorage.removeItem('token');
            })



    });















})